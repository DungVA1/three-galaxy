import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

// Import static files
import stars from './static/stars.jpg';
import sunTexture from './static/sun.jpg';
import mercuryTexture from './static/mercury.jpg';
import earthTexture from './static/earth.jpg';
import moonTexture from './static/moon.jpg';
import marsTexture from './static/mars.jpg';

// Create a SCENE
const scene = new THREE.Scene();
// Is the same texture loader but it's is a cube background
// It have 6 faces, so need to load 6 textures for each face
// When drag the mouse, the backgound is move too
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

// Create a CAMERA
const camera = new THREE.PerspectiveCamera(
  45, // field of view
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
// Set position for camera (x, y, z)
camera.position.set(0, 3, 5);

// Create a RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Add dom rendered by renderer
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// Config GUI to config app on UI
const gui = new GUI();
const options = {
  displayAxis: false,
  rotate: true,
  speed: 0.01,
  wireFrame: false,
};
gui.add(options, 'rotate');
gui.add(options, 'displayAxis');
gui.add(options, 'wireFrame');
gui.add(options, 'speed', 0.01, 1);

// Create an object HERE
// Create a geometry for object
const sunGeometry = new THREE.SphereGeometry(1);
// Create a material for object, meterial is an object includes object's attribute
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  map: textureLoader.load(sunTexture),
  wireframe: options.wireFrame,
});
// Combine object with its material
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Add object to scene
scene.add(sun);

// Create a function to build planets
const createPlanet = (size, positions, texture, satellite) => {
  // Do the same with Sun
  const planetGeometry = new THREE.SphereGeometry(size);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.x = positions[0] || 0;
  planet.position.y = positions[1] || 0;
  planet.position.z = positions[2] || 0;

  const sunStar = new THREE.Object3D();
  let satelliteMesh;
  if (satellite) {
    const satelliteGeo = new THREE.SphereGeometry(satellite.size);
    const satelliteMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(satellite.texture),
    });
    satelliteMesh = new THREE.Mesh(satelliteGeo, satelliteMat);
    satelliteMesh.position.x = satellite.positions[0] || 0;
    sunStar.add(satelliteMesh);
  }

  sunStar.add(planet);
  scene.add(sunStar);

  return { planet, sunStar, satelliteMesh };
};

const mercury = createPlanet(0.1, [2], mercuryTexture);
const earth = createPlanet(0.3, [4], earthTexture, {
  size: 0.15,
  positions: [3.6],
  texture: moonTexture,
});
const mars = createPlanet(0.5, [6], marsTexture);

const pointLight = new THREE.PointLight(0xFFFFFF, 50, 300);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 300);
scene.add(pointLightHelper);

// Add all addons, helper HERE
// Create an Orbit control, this addons to camera focus to object
new OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const animate = () => {
  // Refresh app frame follow screen refresh frame
  requestAnimationFrame(animate);
  if (options.rotate) {
    sun.rotateY(0.001 * options.speed);

    mercury.planet.rotateY(-0.1 * options.speed);
    mercury.sunStar.rotateY(0.009 * options.speed);

    earth.planet.rotateY(0.03 * options.speed);
    earth.satelliteMesh.rotateY(0.1 * options.speed);
    earth.sunStar.rotateY(0.005 * options.speed);

    mars.planet.rotateY(0.019 * options.speed);
    mars.sunStar.rotateY(0.001 * options.speed);
  }

  if (options.displayAxis) {
    scene.add(axesHelper);
  } else {
    scene.remove(axesHelper);
  }

  sun.material.wireframe = options.wireFrame;
  mercury.planet.material.wireframe = options.wireFrame;
  earth.planet.material.wireframe = options.wireFrame;
  mars.planet.material.wireframe = options.wireFrame;

  // Start render processing
  renderer.render(scene, camera);
};

// Resize renderer base on browser screen size
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();