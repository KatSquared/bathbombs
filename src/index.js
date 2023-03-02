// BASIC IMPORTS REQUIRED FOR FUNCTIONING
import './style.css';
import * as THREE from 'three';
// import of other basic features (non-essential)
import {Color} from 'three';
// pass imports (filters)
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass';
// GLB/GLTF model loader import
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';


//
// BASIC SCENE SETUP
//
const canvas = document.querySelector('#background');
const scene = new THREE.Scene();
scene.background = new Color("lightBlue");

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 50);


// disabling antialias because it won't work anyways since we're applying a pass later on
// and so the default antialias will not work - we set up one as a pass instead
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: "high-performance",
    alpha: true
});

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(-3);

const loadingManager = new THREE.LoadingManager();
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}
loadingManager.onLoad = function() {
    progressContainer.classList.add('fading');
}
loadingManager.onError = function(url) {
    console.error(`Failed to load ${url}`);
}
       
const textureLoader = new THREE.TextureLoader(loadingManager);
const glbLoader = new GLTFLoader(loadingManager);

// responsive resizing handler
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.render(scene, camera);

//
// PASSES (filters)
//
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
// the "shining effect" pass
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,
    0.1,
    0.9
);
// antialiasing pass - since adding any pass disables default antialiasing
const antialiasPass = new SMAAPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
);
composer.addPass(bloomPass);
composer.addPass(antialiasPass);

//
// LIGHTS
//
// hexidecimal value in that pointlight
const pointLight = new THREE.PointLight(0xffffff, 0.35);
// position x y z away from center so that it actually lights the object
pointLight.position.set(-15, -5, 20);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(pointLight, ambientLight);

//
// BACKGROUND STARS 
//
const geometry = new THREE.SphereGeometry(0.25, 24, 24);
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
});

function addStar() {
    const star = new THREE.Mesh(geometry, material);
    // coordinates x and y will be randomly generated numbers between -80 and 80
    const [x, y] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(80));
    // will be randomly generated between -29 and 29
    const z = THREE.MathUtils.randFloatSpread(29);
    star.position.set(x, y, z);
    scene.add(star);
}
Array(50).fill().forEach(addStar);

//
// BACKGROUND PLANE SHADERS SETUP    
//
// defining variables to be used inside shaders
const uniforms = {
    u_time: {type: 'f', value: 0.0}, // f is for "float" variable type
    u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        .multiplyScalar(window.devicePixelRatio)}, // for better resolution
    u_mouse: {type: 'v2', value: new THREE.Vector2(0.0, 0.0)},
    image: {type: 't', value: new THREE.TextureLoader().load('src/img/texture1.jpg')}
}
// vector shader -> required for fragment shader to work. 
// newX, newY -> modify position of background plane (that slight waving motion)
const vShader = `
    uniform float u_time;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        float newX = position.x + sin(position.x + u_time) * cos(position.y + u_time) * 0.8;
        float newY = position.y + sin(position.y + u_time + 2.2) * cos(position.x + u_time + 2.2) * 0.1;
        vec3 newPosition = vec3(newX, newY, position.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;
// fragment shader -> responsible for changes of color of the plane's texture
const fShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform sampler2D image;
    varying vec2 vUv;
    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;
        vec4 texture = texture2D(image, vUv);
        float effect = texture.x + 0.2 * u_time;
        gl_FragColor = vec4(abs((sin(effect + 2.2))) * 0.3 + 0.5, abs((sin(effect))) * 0.3 + 0.5, abs((cos(effect + 4.2))) * 0.3 + 0.5, 1.0);
    }
`;
//
// ADDING BACKGROUND PLANE TO THE SCENE (with shaders)
//
const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
    uniforms
});
const planeMesh= new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180),
    planeMaterial
);
scene.add(planeMesh);
planeMesh.position.setZ(-20);

// FOG
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.02);

//
// SPHERICAL BATHBOMBS
//
const bathbombTexture = textureLoader.load('src/img/texture1.jpg');
const bathbombTextureTwo = textureLoader.load('src/img/texture5.jpg');
const bathbombTextureThree = textureLoader.load('src/img/texture3.jpg');
const normalTexture = textureLoader.load('src/img/normal.jpg');
const bathbombGeometry = new THREE.SphereGeometry(8, 32, 32);
const bathbombMaterialTwo = new THREE.MeshLambertMaterial({
    map: bathbombTextureTwo,
    normalMap: normalTexture
});
const bathbombMaterialThree = new THREE.MeshLambertMaterial({
    map: bathbombTextureThree,
    normalMap: normalTexture,
    emissiveIntensity: 0.2,
    emissive: { isColor: true, r: 1, g: 1, b: 1 }
});
const bathbombMaterial = new THREE.MeshLambertMaterial({
    map: bathbombTexture,
    normalMap: normalTexture
})
const bathbombObj = new THREE.Object3D();
const bathbomb = new THREE.Mesh(bathbombGeometry, bathbombMaterial);
const bathbombSecondObj = new THREE.Object3D();
const bathbombSecond = new THREE.Mesh(bathbombGeometry, bathbombMaterialTwo);
const bathbombThirdObj = new THREE.Object3D();
const bathbombThird = new THREE.Mesh(bathbombGeometry, bathbombMaterialThree);

scene.add(bathbombObj, bathbombSecondObj, bathbombThirdObj);

bathbombObj.position.set(-29, -3, 0);
bathbombSecondObj.position.set(-25, -20, -20);
bathbombThirdObj.position.set(5, -30, -2);

bathbombObj.add(bathbomb);
bathbombSecondObj.add(bathbombSecond);
bathbombThirdObj.add(bathbombThird);


//
// HEART
//
glbLoader.load('src/models/heart.glb', (gltf) => {
    const heartModel = gltf.scene;

    heartModel.position.set(25,-8, 0);
    heartModel.scale.set(5, 5, 5);
    heartModel.rotateX(-0.5);
    heartModel.rotateY(-0.5);
    heartModel.name = 'Heart';
	scene.add(heartModel);

    const heart = heartModel.getObjectByName('Tapa_2_Mat_0');

    heart.material.MeshLambertMaterial = true;
    heart.material.MeshStandardMaterial = false;
    heart.material.map = textureLoader.load('src/img/texture6.jpg');
    heart.material.color.setHex(0xFFFFFF);
    heart.material.roughnessMap = normalTexture;
    heart.material.roughness = 1;
    heart.material.normalMap = normalTexture;
    heart.material.lightMap = normalTexture;
    heart.material.emissiveMap = normalTexture;

}, undefined, function (error) {
	console.error(error);
});

const heartObj = new THREE.Object3D();
scene.add(heartObj);
heartObj.position.set(25,-8, 0);

//
// SHINING STAR
//
glbLoader.load('src/models/star.glb', (gltf) => {
    const shiningStarModel = gltf.scene;
    shiningStarModel.position.set(-39,-28, -18);
    shiningStarModel.scale.set(5, 5, 5);
	scene.add(shiningStarModel); 

    const star = shiningStarModel.getObjectByName('Object_4');
    star.material.emissiveIntensity = 0.8;
}, undefined, function (error) {
	console.error(error);
});

//
// MATTE STAR
//
glbLoader.load('src/models/star.glb', (gltf) => {
    const starModel = gltf.scene;
    starModel.position.set(-6, 3, 0);
    starModel.scale.set(10, 10, 10);
    starModel.name = 'Star';
	scene.add(starModel);

    const star = starModel.getObjectByName('Object_4');

    star.material.MeshLambertMaterial = true;
    star.material.MeshPhongMaterial = false;
    star.material.color.setHex(0xFFFFFF);
    star.material.roughnessMap = normalTexture;
    star.material.roughness = 1;
    star.material.normalMap = normalTexture;
    star.material.lightMap = normalTexture;
    star.material.emissive = { isColor: true, r: 1, g: 1, b: 1 };
    star.material.emissiveIntensity = 0.9;
    star.material.emissiveMap = textureLoader.load('src/img/texture7.jpg');

}, undefined, function (error) {
	console.error(error);
});

const matteStarObj = new THREE.Object3D();
scene.add(matteStarObj);
matteStarObj.position.set(-6, 3, 0);


//
// LABELS ON HOVER
//
const labelScene = new THREE.Scene();
const labelObj = new THREE.Mesh(bathbombGeometry, bathbombMaterial);
labelScene.add(labelObj);
labelObj.position.set(0, 0, 10)

// Dreamland (biggest spherical bathbomb) label
const labelOneMaterial = new THREE.MeshBasicMaterial({
    color: 0xb5e4de,
    map: textureLoader.load('src/img/dreamland.png'),
    transparent: true,
    opacity: 0,
});
const labelOneMesh= new THREE.Mesh(
    new THREE.PlaneGeometry(10, 2.725),
    labelOneMaterial
);
// Life is Peachy (smallest spherical bathbomb) label
const labelTwoMaterial = new THREE.MeshBasicMaterial({
    color: 0xb5e4de,
    map: textureLoader.load('src/img/life-is-peachy.png'),
    transparent: true,
    opacity: 0,
});
const labelTwoMesh= new THREE.Mesh(
new THREE.PlaneGeometry(10.275, 2.625),
labelTwoMaterial
);
// Raspberry Swirl (second largest spherical bathbomb at the bottom) label
const labelThreeMaterial = new THREE.MeshBasicMaterial({
    color: 0xb5e4de,
    map: textureLoader.load('src/img/raspberry-swirl.png'),
    transparent: true,
    opacity: 0,
});
const labelThreeMesh= new THREE.Mesh(
    new THREE.PlaneGeometry(11.275, 2.625),
    labelThreeMaterial
    );
// Galaxy Trip (star) label
const labelFourMaterial = new THREE.MeshBasicMaterial({
    color: 0xb5e4de,
    map: textureLoader.load('src/img/galaxy-trip.png'),
    transparent: true,
    opacity: 0,
});
const labelFourMesh= new THREE.Mesh(
    new THREE.PlaneGeometry(10.275, 2.625),
    labelFourMaterial
);
// Just Relax (heart) label
const labelFiveMaterial = new THREE.MeshBasicMaterial({
    color: 0xb5e4de,
    map: textureLoader.load('src/img/just-relax.png'),
    transparent: true,
    // opacity: 0,
});
const labelFiveMesh= new THREE.Mesh(
    new THREE.PlaneGeometry(9.75, 3.25),
    labelFiveMaterial
);

bathbombObj.add(labelOneMesh);
bathbombSecondObj.add(labelTwoMesh);
bathbombThirdObj.add(labelThreeMesh);
matteStarObj.add(labelFourMesh);
heartObj.add(labelFiveMesh);

labelOneMesh.position.set(16, -2, 15);
labelTwoMesh.position.set(16, 6.5, 26);
labelThreeMesh.position.set(2, 8, 10);
labelThreeMesh.scale.set(1.4, 1.4, 1.4);
labelFourMesh.position.set(1, -4, 13);
labelFourMesh.scale.set(0.9, 0.9, 0.9);
labelFiveMesh.position.set(-17, 0, 15);

//
// ANIMATIONS ON SCROLL
//
let direction = 1;

window.addEventListener('wheel', (event) => {  
    if (event.deltaY < 0) {  
      direction = -1;  
    } else if (event.deltaY > 0) {  
      direction = 1;  
    }  
});

//
// OBJECT INTERACTION
//

// elements to exclude from raycasting
const sections = Array.from(document.querySelectorAll('section'));
const sectionsContent = Array.from(document.querySelectorAll('section *'));
const blockquotes = Array.from(document.querySelectorAll('blockquote p'));
const shorthandNavbar = document.getElementById('shorthand-navbar');
const sectionsNavbar = document.getElementById('sections-navbar');
const footer = document.getElementById('footer');

const domElements = [];
domElements.push(...sections, ...sectionsContent, ...blockquotes, shorthandNavbar, sectionsNavbar, footer);

let isDomElement = false;


// Event listener for hover
const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
    // normalising mouse position (because webGL coords are different from browser ones)
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
    if (domElements.includes(e.target)) {
        isDomElement = false;
        return;
    }
    isDomElement = true;
});
const rayCaster = new THREE.Raycaster();

// Event listener for click
const mousePositionOnClick = new THREE.Vector2();
window.addEventListener('click', (e) => {
    mousePositionOnClick.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePositionOnClick.y = - (e.clientY / window.innerHeight) * 2 + 1;
    if (domElements.includes(e.target)) {
        isDomElement = false;
        return;
    }
    isDomElement = true;
})
const clickRayCaster = new THREE.Raycaster();



//
// ON SCROLL ANIMATIONS
//
function moveCamera() {
    // rotation animations
    bathbomb.rotation.x += 0.05;
    bathbomb.rotation.y += 0.075;
    bathbomb.rotation.z += 0.05;
    bathbombSecond.rotation.y += -0.04;
    bathbombThird.rotation.z += -0.03;
    bathbombThird.rotation.y += -0.01;
    
    // parallax movement
    bathbombObj.position.y += direction * 0.05;
    bathbombSecondObj.position.y += direction * 0.08;
    bathbombThirdObj.position.y += direction * 0.13;
 
    scene.position.y += direction * 0.1;
}
document.body.onscroll = moveCamera;
moveCamera();


//
// AUTOMATIC ANIMATIONS = ANIMATION LOOP
//
let step = 0;
const speed = 0.01;
const clock = new THREE.Clock();
let isLinkOneOpened = false;
let isLinkTwoOpened = false;
let isLinkThreeOpened = false;
let isLinkFourOpened = false;
let isLinkFiveOpened = false;

// recursive function calls render method automatically when browser repaints the screen
function animate(time) {
    requestAnimationFrame(animate);

    // time passing for shaders
    uniforms.u_time.value = clock.getElapsedTime();

    // if we change properties inside of this loop - object animates every frame
    step += speed;
    bathbomb.rotation.x = Math.cos(step * 8) * 0.01;
    bathbomb.rotation.y = Math.sin(step * 10) * 0.02;
    bathbombSecond.rotation.z = Math.sin(step * 10) * 0.05;
    bathbombThird.rotation.x = Math.cos(step * 8) * 0.04;
    bathbombThird.rotation.y = Math.sin(step * 10) * 0.03;

    // interactions on hover
    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    const heartModel = scene.getObjectByName('Heart');
    labelOneMesh.material.opacity = 0;
    labelTwoMesh.material.opacity = 0;
    labelThreeMesh.material.opacity = 0;
    labelFourMesh.material.opacity = 0;
    labelFiveMesh.material.opacity = 0;

    for (let i = 0; i < intersects.length; i++){
        // early return when it is a dom element that's on top 
        // -> preventing accidental link opening
        if (isDomElement) {
            // bathbombs
            if (intersects[i].object.id === bathbomb.id) {
                intersects[i].object.rotation.x = time / 1000;
                intersects[i].object.rotation.y = time / 1000;
                labelOneMesh.material.opacity = 1;
            } 
            else if (intersects[i].object.id === bathbombSecond.id) {
                intersects[i].object.rotation.z = time / 1000;
                labelTwoMesh.material.opacity = 1;
            }
            else if (intersects[i].object.id === bathbombThird.id) {
                intersects[i].object.rotation.y = time / 1000;
                labelThreeMesh.material.opacity = 1;
            }
            else if (intersects[i].object.id === 105) {
                intersects[i].object.rotation.z = time / 1000;
                labelFourMesh.material.opacity = 1;
            }
            else if (intersects[i].object.id === 92) {
                heartModel.rotation.z = time / 1000;
                labelFiveMesh.material.opacity = 1;
            }
            // labels
            else if (intersects[i].object.id == labelOneMesh.id) {
                labelOneMesh.position.z += Math.sin(step * 30) * 0.02;
            }
            else if (intersects[i].object.id == labelTwoMesh.id) {
                labelTwoMesh.position.z += Math.sin(step * 30) * 0.02;
            }
            else if (intersects[i].object.id == labelThreeMesh.id) {
                labelThreeMesh.position.z += Math.sin(step * 30) * 0.02;
            }
            else if (intersects[i].object.id == labelFourMesh.id) {
                labelFourMesh.position.z += Math.sin(step * 30) * 0.02;
            }
            else if (intersects[i].object.id == labelFiveMesh.id) {
                labelFiveMesh.position.z += Math.sin(step * 30) * 0.02;
            }
        }
    }
    
    composer.render();

    // clicking at labels would redirect to product pages - however, for the sake of 
    // simplicity of this portfolio project, it redirects to other already existing subpages
        clickRayCaster.setFromCamera(mousePositionOnClick, camera);
        let clickIntersects = clickRayCaster.intersectObjects(scene.children);
        
        for (let i = 0; i < clickIntersects.length; i++){
            // early return when it is a dom element that's on top 
            // -> preventing accidental link opening
            if (isDomElement) return;

            else if (clickIntersects[i].object.id === labelOneMesh.id && labelOneMesh.material.opacity === 1) {
                if (!isLinkOneOpened) {
                    window.open('blueberry-dream.html');
                    isLinkOneOpened = true;
                    isLinkTwoOpened = isLinkThreeOpened = isLinkFourOpened = isLinkFiveOpened = false;
                }
                else return;
            }
            else if (clickIntersects[i].object.id === labelTwoMesh.id && labelTwoMesh.material.opacity === 1) {
                if (!isLinkTwoOpened) {
                    window.open('special-offer.html');
                    isLinkTwoOpened = true;
                    isLinkOneOpened = isLinkThreeOpened = isLinkFourOpened = isLinkFiveOpened = false;
                }
                else return;     
            } 
            else if (clickIntersects[i].object.id === labelThreeMesh.id && labelThreeMesh.material.opacity === 1) {
                if (!isLinkThreeOpened) {
                    window.open('bathbombs.html');
                    isLinkThreeOpened = true;
                    isLinkOneOpened = isLinkTwoOpened = isLinkFourOpened = isLinkFiveOpened = false;
                }
                else return;     
            } 
            else if (clickIntersects[i].object.id === labelFourMesh.id && labelFourMesh.material.opacity === 1) {
                if (!isLinkFourOpened) {
                    window.open('soaps.html');
                    isLinkFourOpened = true;
                    isLinkOneOpened = isLinkTwoOpened = isLinkThreeOpened = isLinkFiveOpened = false;
                }
                else return;     
            } 
            else if (clickIntersects[i].object.id === labelFiveMesh.id && labelFiveMesh.material.opacity === 1) {
                if (!isLinkFiveOpened) {
                    window.open('basket.html');
                    isLinkFiveOpened = true;
                    isLinkOneOpened = isLinkTwoOpened = isLinkThreeOpened = isLinkFourOpened = false;
                }
                else return;     
            } 
        }
    
}

animate();