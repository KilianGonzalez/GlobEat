import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const MODEL_PATHS = [
    '../blender/huevofrito.glb',
    '../blender/salchicha.glb',
    '../blender/churro.glb',
    '../blender/cruassan.glb',
    '../blender/crepe.glb'
];

const INSTANCE_COUNT = 14;

function createCascadeForCanvas(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / Math.max(height, 1), 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const bgSource = getComputedStyle(container.parentElement || container).backgroundColor;
    try {
        renderer.setClearColor(new THREE.Color(bgSource), 1);
    } catch (e) {
        renderer.setClearColor(0xECE6DE, 1);
    }

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    const loadModel = (path) => {
        return new Promise((resolve, reject) => {
            loader.load(
                path,
                (gltf) => {
                    const model = gltf.scene;
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    const box = new THREE.Box3().setFromObject(model);
                    const size = new THREE.Vector3();
                    const center = new THREE.Vector3();
                    box.getSize(size);
                    box.getCenter(center);
                    model.position.sub(center);

                    const targetSize = 2.5;
                    const scale = targetSize / Math.max(size.x, size.y, size.z);
                    model.scale.setScalar(scale);

                    resolve(model);
                },
                undefined,
                (err) => reject(err)
            );
        });
    };

    Promise.all(MODEL_PATHS.map(loadModel))
        .then((loadedModels) => {
            const instances = [];

            for (let i = 0; i < INSTANCE_COUNT; i++) {
                const baseModel = loadedModels[i % loadedModels.length];
                const instance = baseModel.clone(true);

                const x = (Math.random() - 0.5) * 18;
                const y = Math.random() * 20 + 10;
                const z = (Math.random() - 0.5) * 4;
                instance.position.set(x, y, z);

                instance.rotation.x = Math.random() * Math.PI;
                instance.rotation.y = Math.random() * Math.PI;

                const scaleFactor = 0.7 + Math.random() * 0.6;
                instance.scale.multiplyScalar(scaleFactor);

                const speed = 0.03 + Math.random() * 0.04;

                scene.add(instance);
                instances.push({ mesh: instance, speed });
            }

            function animate() {
                requestAnimationFrame(animate);

                instances.forEach((item) => {
                    const { mesh, speed } = item;
                    mesh.position.y -= speed;
                    mesh.rotation.y += 0.005;

                    if (mesh.position.y < -15) {
                        mesh.position.y = Math.random() * 20 + 10;
                        mesh.position.x = (Math.random() - 0.5) * 18;
                        mesh.position.z = (Math.random() - 0.5) * 4;
                    }
                });

                renderer.render(scene, camera);
            }

            animate();
        })
        .catch((error) => {
            console.error('Error al cargar modelos para la cascada 3D:', error);
        });

    window.addEventListener('resize', () => {
        const rect = container.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = rect.height || 1;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    createCascadeForCanvas('login-3d-canvas');
    createCascadeForCanvas('register-3d-canvas');
});
