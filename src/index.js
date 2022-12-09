import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import {TextureLoader} from 'three';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {FilmPass} from 'three/examples/jsm/postprocessing/FilmPass';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#background'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(-3);

const textureLoader = new THREE.TextureLoader();

const glbLoader = new GLTFLoader();

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.render(scene, camera);

// PASSES
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,
    0.1,
    0.9
);
const filmPass = new FilmPass (
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.52,
    0.28,
    0, 0
);
composer.addPass(bloomPass);
composer.addPass(filmPass);

// THINGS FOR SHADERS
const uniforms = {
    u_time: {type: 'f', value: 0.0}, // f is for "float" variable type
    u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        .multiplyScalar(window.devicePixelRatio)}, // for better resolution
    u_mouse: {type: 'v2', value: new THREE.Vector2(0.0, 0.0)},
    image: {type: 't', value: new THREE.TextureLoader().load('src/img/cube1.jpg')}
}
window.addEventListener('mousemove', function(e) {
    uniforms.u_mouse.value.set(e.screenX / window.innerWidth, 1 - e.screenY / window.innerHeight);
});

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

// LIGHTS
// hexidecimal value in that pointlight
const pointLight = new THREE.PointLight(0xffffff, 0.35);
// position x y z away from center so that it actually lights the object
pointLight.position.set(-15, -5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(pointLight, ambientLight);

// STARS 
const geometry = new THREE.SphereGeometry(0.25, 24, 24);
const material = new THREE.MeshStandardMaterial({color: 0xffffff});

function addStar() {
    const star = new THREE.Mesh(geometry, material);
    // coordinates will be randomly generated numbers between -100 and 100
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);

// BATHBOMBS
const bathbombTexture = textureLoader.load('src/img/cube1.jpg');
const bathbombTextureTwo = textureLoader.load('src/img/cube2.jpg');
const bathbombTextureThree = textureLoader.load('src/img/cube3.jpg');
const normalTexture = textureLoader.load('src/img/normal.jpg');
const bathbombGeometry = new THREE.SphereGeometry(8, 32, 32);
const bathbombMaterialTwo = new THREE.MeshStandardMaterial({
    map: bathbombTextureTwo,
    normalMap: normalTexture
});
const bathbombMaterialThree = new THREE.MeshStandardMaterial({
    map: bathbombTextureThree,
    normalMap: normalTexture
});
const bathbombMaterial = new THREE.MeshStandardMaterial({
    map: bathbombTexture,
    normalMap: normalTexture
})
const bathbomb = new THREE.Mesh(bathbombGeometry, bathbombMaterial);
const bathbombSecond = new THREE.Mesh(bathbombGeometry, bathbombMaterialTwo);
const bathbombThird = new THREE.Mesh(bathbombGeometry, bathbombMaterialThree);

scene.add(bathbomb, bathbombSecond, bathbombThird);
bathbomb.position.set(-25, -2, 0);
bathbombSecond.position.set(-20, -14, -20);
bathbombThird.position.set(0, -30, -2);

// HEART
let heart;
glbLoader.load('src/models/heart.glb', (gltf) => {
    heart = gltf.scene;

    heart.position.set(10,-18,10);
    heart.scale.set(10, 10, 10);
	scene.add(heart);
}, undefined, function (error) {
	console.error(error);
});

// STAR
let starModel;
glbLoader.load('src/models/star.glb', (gltf) => {
    starModel = gltf.scene;
    starModel.position.set(-10,-38,10);
    starModel.scale.set(10, 10, 10);
	scene.add(starModel);
}, undefined, function (error) {
	console.error(error);
});

// CUPCAKE
let cupcake;
glbLoader.load('src/models/cupcake.glb', (gltf) => {
    cupcake = gltf.scene;
    cupcake.position.set(20,-13,10);
    cupcake.scale.set(10, 10, 10);
    console.log(cupcake);
	scene.add(cupcake);
}, undefined, function (error) {
	console.error(error);
});


// BACKGROUND PLANE
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

//FOG
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.02);

const clock = new THREE.Clock();

// Scroll Animation
let direction = 1;

window.addEventListener('wheel', (event) => {  
    if (event.deltaY < 0) {  
      direction = -1;  
    } else if (event.deltaY > 0) {  
      direction = 1;  
    }  
});

function moveCamera() {
    // rotation animations
    bathbomb.rotation.x += 0.05;
    bathbomb.rotation.y += 0.075;
    bathbomb.rotation.z += 0.05;
    bathbombSecond.rotation.x += -0.03;
    bathbombSecond.rotation.y += -0.04;
    // parallax movement
    bathbomb.position.y += direction * 0.6;
    bathbombSecond.position.y += direction * 0.6;
    bathbombThird.position.y += direction * 0.5;
    // heart.position.y += direction * 0.2;
    // starModel.position.y += direction * 0.2;
    // cupcake.position.y += direction * 0.2;
    scene.position.y += direction * 0.1;
}
document.body.onscroll = moveCamera;
moveCamera();

// GUI - color palette, mesh mode - extra helpers etc
const gui = new dat.GUI();
const options = { 
    speed: 0.01
};

// OBJECT INTERACTION
// const mousePosition = new THREE.Vector2();
// window.addEventListener('mousemove', function(e){
//     // normalising mouse position (cuz webGL coords are diff from browser ones)
//     mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
//     mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
// });
// const rayCaster = new THREE.Raycaster();

let step = 0;

// recursive function calls render method automatically when browser repaints the screen
function animate(time) {
    requestAnimationFrame(animate);

    // time passing for shaders
    uniforms.u_time.value = clock.getElapsedTime();

    // if we change properties inside of this loop - object animates every frame
    step += options.speed;
    bathbomb.rotation.x = Math.cos(step * 8) * 0.01;
    bathbomb.rotation.y = Math.sin(step * 10) * 0.02;

    // interactions on hover
    // rayCaster.setFromCamera(mousePosition, camera);
    // const intersects = rayCaster.intersectObjects(scene.children);

    // for (let i = 0; i < intersects.length; i++){
    //     if (intersects[i].object.id === sphereId)
    //         intersects[i].object.material.color.set(0x550033);
    // }

    composer.render();
}

animate();




//? looks like a deep sea creature swimming
// float newX = cos(position.x + 0.1 * u_time) * cos(position.y + 2.0 * u_time);
//         vec3 newPosition = vec3(newX, position.y, position.z);
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);