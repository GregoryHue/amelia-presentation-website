import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelUrl from '../assets/amelia.glb?url';
import { MIN_VIEWPORT_WIDTH } from '../backgroundModelConfig';
import { shouldShowSplash, subscribeSplashPlayed } from '../splashState';
import './BackgroundModel.css';

// Simple screen-space spot per route (x/y as fractions of the viewport,
// 0-1) — purely decorative background placement, not fitted around any
// page's text. Converted to world space via unproject() each frame so it
// still tracks the same relative spot when the window resizes (a raw
// world-space position would drift on resize, since it projects
// differently once the camera's aspect ratio changes).
const ROUTE_TARGETS = {
  '/': { x: 0.59, y: 0.25, depth: 0, scale: 1 },
  '/approach': { x: 0.35, y: 0.65, depth: 0, scale: 1.3 },
  '/contact': { x: 0.50, y: 0.50, depth: 0, scale: 1.6  },
};

// Where the model sits strictly while the Home splash is covering the
// hero (see `aboveSplash` below) — independent of '/'s own target, which
// only applies once the splash has actually finished or been skipped.
const SPLASH_TARGET = { x: 0.5, y: 0.25, depth: 0, scale: 0.7 };

const DEFAULT_TARGET = ROUTE_TARGETS['/'];

function getTarget(pathname, splashActive) {
  if (pathname === '/' && splashActive) return SPLASH_TARGET;
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
  const targetRef = useRef(getTarget(location.pathname, location.pathname === '/' && shouldShowSplash()));
  // The model normally renders *behind* page content (see the CSS: no
  // explicit z-index, so it stacks by DOM order behind the sections,
  // which are positioned too). The one exception is the Home splash,
  // which sits in front of the hero on purpose to hide it pre-reveal —
  // while that's happening, the model needs to jump in front of it too,
  // or it'd be invisible during the intro. `splashState` is the shared
  // source of truth HomePage also uses, so both stay in sync without
  // prop-drilling across the route tree.
  const [aboveSplash, setAboveSplash] = useState(location.pathname === '/' && shouldShowSplash());

  useEffect(() => {
    const splashActive = location.pathname === '/' && shouldShowSplash();
    targetRef.current = getTarget(location.pathname, splashActive);
    setAboveSplash(splashActive);
  }, [location]);

  useEffect(() => {
    // The splash doesn't vanish instantly — it fades out over 0.6s (see
    // .hero__splash's transition in Hero.css). Dropping the z-index boost
    // the instant the splash is marked "played" put the model back behind
    // a still-semi-opaque splash for that whole 0.6s, so it visibly
    // blinked out and back in. Wait out the same fade before reverting.
    let timeoutId = null;
    const unsubscribe = subscribeSplashPlayed(() => {
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      timeoutId = setTimeout(
        () => {
          setAboveSplash(false);
          // Splash is done — glide from SPLASH_TARGET over to Home's own
          // spot, the same way the model moves between pages.
          targetRef.current = ROUTE_TARGETS['/'];
        },
        0
      );
    });
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

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

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xda5e57, 0.7);
    rimLight.position.set(-4, -2, -3);
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
    loader.load(modelUrl, (gltf) => {
      if (disposed) return;
      group = gltf.scene;
      group.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.65,
            metalness: 0.05,
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
        if (!reduceMotion) {
          group.rotation.y += delta * 0.3;
          group.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.08;
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

  return (
    <canvas
      ref={canvasRef}
      className={`background-model ${aboveSplash ? 'background-model--above-splash' : ''}`}
      aria-hidden="true"
    />
  );
}

export default BackgroundModel;
