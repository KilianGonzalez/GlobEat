import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Variables globales
let scene, camera, renderer, container, logoModel, logoGroup, outerPart, innerPart;

// Inicializar la escena
function init() {
    container = document.getElementById('hero-canvas');
    const { width, height } = container.getBoundingClientRect();

    // Crear la escena
    scene = new THREE.Scene();

    // Crear la cámara
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 6.5);

    // Crear el renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xe8d6c1, 1);
    container.appendChild(renderer.domElement);

    // Agregar luces
    addLights();

    // Cargar modelo
    loadLogoModel();

    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', onWindowResize, false);

    // Iniciar el loop de renderizado
    animate();
}

// Configurar luces
function addLights() {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
    directionalLight.position.set(6, 8, 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 4, 6);
    scene.add(fillLight);
}

// Cargar modelo GLB
function loadLogoModel() {
    const loader = new GLTFLoader();
    loader.load(
        '../blender/logo.glb',
        (gltf) => {
            logoModel = gltf.scene;
            logoModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            const children = logoModel.children.filter((child) => child.isMesh || child.type === 'Group');
            outerPart = children[0] || logoModel;
            innerPart = children[1] || null;

            const box = new THREE.Box3().setFromObject(logoModel);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            logoModel.position.sub(center); // centrar en el origen
            const targetScale = 5 / Math.max(size.x, size.y, size.z);
            logoModel.scale.setScalar(targetScale);
            logoModel.position.y = -2.5;
            logoGroup = new THREE.Group();
            logoGroup.add(logoModel);
            logoGroup.position.set(0, -2.5, 0);
            scene.add(logoGroup);

            camera.lookAt(logoGroup.position);
        },
        undefined,
        (error) => {
            console.error('Error al cargar logo.glb', error);
        }
    );
}

// Manejar redimensionamiento de ventana
function onWindowResize() {
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Loop de animación
function animate() {
    requestAnimationFrame(animate);

    if (logoGroup) {
        logoGroup.rotation.y += 0.006;
        if (outerPart) {
            outerPart.rotation.y += 0.01;
        }
        if (innerPart) {
            innerPart.rotation.y -= 0.02;
        }
    }

    renderer.render(scene, camera);
}

// Inicializar cuando se carga la página
window.addEventListener('DOMContentLoaded', init);