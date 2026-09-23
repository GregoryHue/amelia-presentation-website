import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import modelUrl from '../assets/amelia.glb?url';
import { MIN_VIEWPORT_WIDTH } from '../backgroundModelConfig';
import './BackgroundModel.css';

// Simple screen-space spot per route (x/y as fractions of the viewport,
// 0-1) — purely decorative background placement, not fitted around any
// page's text. Converted to world space via unproject() each frame so it
// still tracks the same relative spot when the window resizes (a raw
// world-space position would drift on resize, since it projects
// differently once the camera's aspect ratio changes).
const ROUTE_TARGETS = {
  '/': { x: 0.59, y: 0.25, depth: 0, scale: 0.3 },
  '/approach': { x: 0.35, y: 0.65, depth: 0, scale: 0.7 },
  '/team': { x: 0.75, y: 0.25, depth: 0, scale: 0.5 },
  '/demo': { x: 0.88, y: 0.18, depth: 0, scale: 0.4 },
  // spin: false — on Contact the model settles to face the camera head-on
  // instead of continuing its idle spin (see the animate loop below).
  // y is pushed below the visible frame (>1) and scale is large, so only
  // the top portion (head/shoulders, which sits above the model's own
  // center pivot) remains in view — the rest extends off-screen at the
  // bottom, cropped by the camera frustum like a portrait close-up.
  '/contact': { x: 0.50, y: 0.60, depth: 0, scale: 0.9, spin: false },
};

const DEFAULT_TARGET = ROUTE_TARGETS['/'];

function getTarget(pathname) {
  return ROUTE_TARGETS[pathname] || DEFAULT_TARGET;
}

function targetToWorld(camera, target) {
  const ndcX = target.x * 2 - 1;
  const ndcY = -(target.y * 2 - 1);
  const point = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
  const direction = point.sub(camera.position).normalize();
  const distance = (target.depth - camera.position.z) / direction.z;
  return camera.position.clone().add(direction.multiplyScalar(distance));
}

function BackgroundModel() {
  const canvasRef = useRef(null);
  const location = useLocation();
  // Renders *behind* page content (see the CSS: no explicit z-index, so
  // it stacks by DOM order behind the sections, which are positioned
  // too) — including the Home splash, which stays in front of it the
  // whole time it's covering the hero, so the model simply isn't visible
  // until the splash has faded away.
  const targetRef = useRef(getTarget(location.pathname));

  useEffect(() => {
    targetRef.current = getTarget(location.pathname);
  }, [location]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.innerWidth < MIN_VIEWPORT_WIDTH) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);
    // A camera's matrixWorld isn't recomputed the instant .position is set
    // — it only updates during renderer.render() (or an explicit call
    // like this one). targetToWorld()'s unproject() reads matrixWorld
    // directly, so computing the model's initial position below, before
    // any render has ever happened, was unprojecting against the
    // camera's stale default (as if still at the origin) — producing a
    // much-too-small position that then visibly snapped/dragged to the
    // correct spot once real render() calls started keeping the matrix
    // in sync each frame. This call fixes that for the very first frame.
    camera.updateMatrixWorld(true);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Filmic tone mapping gives highlights a softer, more natural falloff
    // than the flat default.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Dimmer, neutral-white studio lighting — keeps the model's dark clay
    // vertex-color tone rather than lifting it toward grey/white.
    // scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    // Key: pure white, no warmth — a plainly "white light" cast.
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

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
    let group = null;
    // Use the current route's target, not DEFAULT_TARGET — the effect
    // above (declared earlier, so it runs first) has already set
    // targetRef to match location by the time this runs. Using
    // DEFAULT_TARGET unconditionally here meant a direct load of
    // /approach or /contact spawned the model at Home's spot first and
    // only then animated to the right one.
    const currentPos = targetToWorld(camera, targetRef.current);
    let currentScale = targetRef.current.scale;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(modelUrl, (gltf) => {
      if (disposed) return;
      group = gltf.scene;
      group.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.55,
            metalness: 0.03,
            emissive: new THREE.Color(0x000000),
            emissiveIntensity: 0,
          });
        }
      });
      group.position.copy(currentPos);
      group.scale.setScalar(currentScale);
      scene.add(group);
    });

    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (group) {
        const facingCamera = targetRef.current.spin === false;

        if (!reduceMotion) {
          if (facingCamera) {
            // Ease down to a stop facing the camera (rotation 0) rather
            // than snapping — decays fast when there's a lot of spin
            // still built up, and settles cleanly once close to 0.
            const rotLerp = 1 - Math.pow(0.001, delta);
            group.rotation.y += (0 - group.rotation.y) * rotLerp;
            group.rotation.x += (0 - group.rotation.x) * rotLerp;
          } else {
            group.rotation.y += delta * 0.3;
            group.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.08;
          }
        }

        const targetPos = targetToWorld(camera, targetRef.current);
        const lerpFactor = reduceMotion ? 1 : 1 - Math.pow(0.0008, delta);
        currentPos.lerp(targetPos, lerpFactor);
        currentScale += (targetRef.current.scale - currentScale) * lerpFactor;
        group.position.copy(currentPos);
        group.scale.setScalar(currentScale);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="background-model" aria-hidden="true" />;
}

export default BackgroundModel;
