import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import modelUrl from '../assets/amelia.glb?url';
import { MIN_VIEWPORT_WIDTH } from '../backgroundModelConfig';
import { markModelLoaded } from '../splashState';
import './BackgroundModel.css';

// The model itself never moves — it's recentered on load (see
// recenterAndScale below) and stays at the world origin. What changes per
// route is the camera: explicit position + lookAt per page, so each page
// gets its own framing while the model always reads as "centered".
// lookAt defaults to the model's center (0,0,0) if omitted.
const CAMERA_POSES = {
  '/': { position: { x: 4, y: 1, z: 3 }, lookAt: { x: 0, y: -0.5, z: 0 } },
  '/approach': { position: { x: -3, y: -0.5, z: 3 }, lookAt: { x: 3, y: 0, z: -3 } },
  '/team': { position: { x: -4.17, y: 1.36, z: 3.31 }, lookAt: { x: 0, y: 0, z: 0 } },
  '/demo': { position: { x: 2.52, y: 2.88, z: 4.62 }, lookAt: { x: 0, y: 0, z: 0 } },
  '/contact': { position: { x: 0.2, y: 0.48, z: 3.97 }, lookAt: { x: 0, y: 0, z: 0 } },
};

const DEFAULT_POSE = CAMERA_POSES['/'];

function getCameraPose(pathname) {
  return CAMERA_POSES[pathname] || DEFAULT_POSE;
}

// Normalizes whatever scale/origin a swapped-in model happens to be
// authored at: uniformly scales it to a consistent on-screen size, then
// shifts it so its bounding-box center sits exactly at the world origin —
// which is also where the camera always looks, so the model lands dead
// center regardless of its own source units or pivot placement.
const TARGET_SIZE = 2.4;

function recenterAndScale(object) {
  const rawBox = new THREE.Box3().setFromObject(object);
  const rawSize = rawBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z);
  const scale = maxDim > 0 ? TARGET_SIZE / maxDim : 1;
  object.scale.setScalar(scale);

  const scaledBox = new THREE.Box3().setFromObject(object);
  const center = scaledBox.getCenter(new THREE.Vector3());
  object.position.sub(center);

  return { groundY: scaledBox.min.y - center.y };
}

function BackgroundModel() {
  const canvasRef = useRef(null);
  const location = useLocation();
  // Renders *behind* page content (see the CSS: no explicit z-index, so
  // it stacks by DOM order behind the sections, which are positioned
  // too) — including the Home splash, which stays in front of it the
  // whole time it's covering the hero, so the model simply isn't visible
  // until the splash has faded away.
  const targetRef = useRef(getCameraPose(location.pathname));

  useEffect(() => {
    targetRef.current = getCameraPose(location.pathname);
  }, [location]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.innerWidth < MIN_VIEWPORT_WIDTH) {
      // Nothing for the splash screen to wait on — let it know there's no
      // model coming so it doesn't hang until its fallback timeout.
      markModelLoaded();
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    // Sized off the canvas's own box (see BackgroundModel.css — it's
    // pinned to a corner, not the full viewport), not the window.
    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // Filmic tone mapping gives highlights a softer, more natural falloff
    // than the flat default.
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1.1;
    // renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Dimmer, neutral-white studio lighting — keeps the model's dark clay
    // vertex-color tone rather than lifting it toward grey/white.
    // scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    // Key: pure white, no warmth — a plainly "white light" cast. Also the
    // one light that casts a shadow, onto the ground plane below.
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0015;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Invisible except where the model's shadow falls on it — lets the
    // shadow read against whatever the page looks like behind the canvas
    // (renderer alpha is on) instead of needing an actual visible floor.
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: 0.28 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Fill: white, fairly strong — keeps shadows soft and open rather
    // than letting the key light carve out hard contrast.
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-3, 1, 3);
    scene.add(fillLight);

    // Rim: white as well now (was the saturated accent red), just enough
    // to separate the silhouette from the background without tinting it.
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(-4, 2.5, -4);
    scene.add(rimLight);

    let disposed = false;
    let rafId = null;
    let mixer = null;
    // Camera pose, lerped toward targetRef.current each frame (position
    // and look-at target both ease independently, exponential decay).
    const currentPosition = new THREE.Vector3(
      targetRef.current.position.x,
      targetRef.current.position.y,
      targetRef.current.position.z
    );
    const currentLookAt = new THREE.Vector3(
      targetRef.current.lookAt?.x ?? 0,
      targetRef.current.lookAt?.y ?? 0,
      targetRef.current.lookAt?.z ?? 0
    );

    // Some exports (e.g. Blender's glTF exporter with mesh compression
    // enabled) mark KHR_draco_mesh_compression as required — without a
    // DRACOLoader registered, GLTFLoader refuses to load the file at all
    // and fails silently unless an onError callback is given.
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        const group = gltf.scene;
        group.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow = true;
          // Only the earlier vertex-color sculpt export needs the flat
          // clay material below. Textured exports (baseColorTexture etc.)
          // keep whatever material the glTF actually defines.
          const hasVertexColors = !!child.geometry.getAttribute('color');
          if (hasVertexColors) {
            child.material = new THREE.MeshStandardMaterial({
              vertexColors: true,
              roughness: 0,
              metalness: 0,
              emissive: new THREE.Color(0x000000),
              emissiveIntensity: 0,
            });
          }
        });

        const { groundY } = recenterAndScale(group);
        ground.position.set(0, groundY, 0);
        keyLight.target.position.set(0, 0, 0);
        scene.add(group);

        // Play whatever clips came baked into the file (e.g. LittlestTokyo
        // ships one looping animation of the scene's own moving parts).
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(group);
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        }

        markModelLoaded();
      },
      undefined,
      (error) => {
        console.error('BackgroundModel: failed to load background model', error);
        // Loading failed — still tell the splash there's nothing more to
        // wait for, so it falls back to its minimum-duration dismiss.
        markModelLoaded();
      }
    );

    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer && !reduceMotion) mixer.update(delta);

      // Exponential-decay smoothing: this constant is the fraction of the
      // remaining distance closed per second — closer to 0 snaps almost
      // instantly, closer to 1 eases much more slowly. 0.0008 settled in
      // well under a second; 0.05 takes a couple of seconds to catch up.
      const lerpFactor = reduceMotion ? 1 : 1 - Math.pow(0.05, delta);
      const targetPosition = targetRef.current.position;
      const targetLookAt = targetRef.current.lookAt ?? { x: 0, y: 0, z: 0 };
      currentPosition.lerp(new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z), lerpFactor);
      currentLookAt.lerp(new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z), lerpFactor);

      camera.position.copy(currentPosition);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };
    animate();

    // Tracks the canvas's own box, not the window — it still fires on
    // window resizes (the box is sized in vw/vh), but also covers the box
    // itself ever changing size for any other reason.
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.clientWidth === 0 || canvas.clientHeight === 0) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    });
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      dracoLoader.dispose();
      mixer?.stopAllAction();
    };
  }, []);

  return <canvas ref={canvasRef} className="background-model" aria-hidden="true" />;
}

export default BackgroundModel;
