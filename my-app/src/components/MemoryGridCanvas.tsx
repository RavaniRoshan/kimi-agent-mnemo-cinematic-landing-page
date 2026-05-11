import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useWebGLVisibility } from '../hooks/useWebGLVisibility';

const GRID_PRESETS = [
  { name: 'Calm Ocean', color: 0x1E3A5F, scaleY: 1, baseWidth: 3, opacity: 0.12, minHeight: 5, maxHeight: 100, freqX: 0.5, freqY: 0.3, ampX: 50, ampY: 50, speed: 0.5, mouseInflation: 0.5 },
  { name: 'Deep Space', color: 0x0B1426, scaleY: 1.2, baseWidth: 2, opacity: 0.08, minHeight: 10, maxHeight: 120, freqX: 0.3, freqY: 0.2, ampX: 60, ampY: 70, speed: 0.3, mouseInflation: 0.3 },
  { name: 'Electric Pulse', color: 0x2D1B69, scaleY: 0.8, baseWidth: 4, opacity: 0.15, minHeight: 20, maxHeight: 80, freqX: 0.8, freqY: 0.6, ampX: 40, ampY: 40, speed: 0.8, mouseInflation: 0.6 },
  { name: 'Sunset Wave', color: 0x5B2E5A, scaleY: 1, baseWidth: 3, opacity: 0.1, minHeight: 15, maxHeight: 90, freqX: 0.4, freqY: 0.5, ampX: 55, ampY: 55, speed: 0.4, mouseInflation: 0.4 },
  { name: 'Forest Whisper', color: 0x1B4D3E, scaleY: 1.1, baseWidth: 2.5, opacity: 0.09, minHeight: 8, maxHeight: 110, freqX: 0.6, freqY: 0.4, ampX: 45, ampY: 65, speed: 0.35, mouseInflation: 0.5 },
  { name: 'Aurora Wave', color: 0x1E3A5F, scaleY: 1, baseWidth: 3, opacity: 0.12, minHeight: 5, maxHeight: 100, freqX: 0.5, freqY: 0.3, ampX: 50, ampY: 50, speed: 0.5, mouseInflation: 0.5 },
  { name: 'Neon City', color: 0xFF006E, scaleY: 0.9, baseWidth: 3.5, opacity: 0.18, minHeight: 25, maxHeight: 75, freqX: 0.7, freqY: 0.7, ampX: 35, ampY: 45, speed: 0.6, mouseInflation: 0.7 },
  { name: 'Arctic Frost', color: 0xA8DADC, scaleY: 1.3, baseWidth: 2, opacity: 0.06, minHeight: 12, maxHeight: 130, freqX: 0.25, freqY: 0.35, ampX: 65, ampY: 55, speed: 0.25, mouseInflation: 0.3 },
  { name: 'Volcanic', color: 0xE85D04, scaleY: 0.7, baseWidth: 4, opacity: 0.2, minHeight: 30, maxHeight: 70, freqX: 0.9, freqY: 0.5, ampX: 30, ampY: 50, speed: 0.9, mouseInflation: 0.8 },
  { name: 'Neural Pulse', color: 0xD4A574, scaleY: 1, baseWidth: 2, opacity: 0.2, minHeight: 10, maxHeight: 80, freqX: 0.3, freqY: 0.5, ampX: 40, ampY: 60, speed: 0.4, mouseInflation: 0.8 },
  { name: 'Bio Luminescence', color: 0x2EC4B6, scaleY: 1.1, baseWidth: 2.5, opacity: 0.14, minHeight: 18, maxHeight: 95, freqX: 0.55, freqY: 0.45, ampX: 50, ampY: 60, speed: 0.45, mouseInflation: 0.6 },
  { name: 'Solar Wind', color: 0xF4A261, scaleY: 0.85, baseWidth: 3, opacity: 0.16, minHeight: 22, maxHeight: 85, freqX: 0.65, freqY: 0.55, ampX: 42, ampY: 48, speed: 0.55, mouseInflation: 0.5 },
  { name: 'Quantum Field', color: 0x7209B7, scaleY: 1.05, baseWidth: 2.8, opacity: 0.11, minHeight: 14, maxHeight: 105, freqX: 0.45, freqY: 0.65, ampX: 48, ampY: 52, speed: 0.38, mouseInflation: 0.4 },
  { name: 'Digital Rain', color: 0x06FFA5, scaleY: 1.4, baseWidth: 1.8, opacity: 0.22, minHeight: 35, maxHeight: 60, freqX: 1.0, freqY: 0.8, ampX: 25, ampY: 35, speed: 1.2, mouseInflation: 0.3 },
];

const vertexShader = `
  uniform float uTime;
  uniform float uBaseWidth;
  uniform float uAmpY;
  uniform vec2 uMouse;
  uniform float uMouseInflation;
  varying vec2 vUv;
  varying float vHeight;

  void main() {
    vUv = uv;
    vec3 pos = position;
    vec3 instancePos = instanceMatrix[3].xyz;

    float distToMouse = length(instancePos.xy - uMouse);
    float mouseInflation = uMouseInflation * 15.0 * smoothstep(300.0, 0.0, distToMouse);
    float mouseWidthInflation = uMouseInflation * 2.5 * smoothstep(200.0, 0.0, distToMouse);

    float waveX = 0.5 + 0.5 * sin(instancePos.x * 0.02 + uTime * 0.001);
    float waveY = sin(instancePos.y * 0.05 + uTime * 0.001);
    float wave = waveX * (0.8 + 0.2 * waveY);

    float targetHeight = 20.0 + uAmpY * wave * 50.0;
    targetHeight += mouseInflation * 20.0;
    targetHeight *= 1.0 + 0.3 * sin(uTime * 0.005 + instancePos.x * 0.01);
    targetHeight = max(targetHeight, 1.0);

    vHeight = targetHeight;

    if (pos.y > 0.5) {
      pos.y = targetHeight;
    }
    pos.x *= uBaseWidth + mouseWidthInflation;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vHeight;

  void main() {
    vec3 color = mix(uColor1, uColor2, vUv.y);
    float alpha = uOpacity * (0.3 + 0.7 * vUv.y);
    float glow = 1.0 - smoothstep(0.0, 0.3, vUv.y);
    alpha += glow * 0.2;
    gl_FragColor = vec4(color, alpha);
  }
`;

interface MemoryGridCanvasProps {
  fadeIn?: boolean;
}

export default function MemoryGridCanvas({ fadeIn = true }: MemoryGridCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useWebGLVisibility(containerRef);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const frustumSize = 700;
    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      -aspect * frustumSize / 2,
      aspect * frustumSize / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );
    camera.position.z = 50;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const config = GRID_PRESETS[5]; // Aurora preset

    const grid = { width: 130, height: 50, spacingX: 18, spacingY: 25 };

    const barGeometry = new THREE.BoxGeometry(1, 1, 1);
    barGeometry.translate(0, 0.5, 0);

    const barMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(config.color) },
        uColor2: { value: new THREE.Color(0xffffff) },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uMouseInflation: { value: config.mouseInflation },
        uBaseWidth: { value: config.baseWidth },
        uAmpY: { value: config.ampY },
        uOpacity: { value: config.opacity },
        uTimeScale: { value: config.speed },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const cols = grid.width;
    const rows = grid.height;
    const count = cols * rows;

    const gridMesh = new THREE.InstancedMesh(barGeometry, barMaterial, count);
    scene.add(gridMesh);

    const dummy = new THREE.Object3D();
    const centerX = (cols - 1) * grid.spacingX / 2;
    const centerY = (rows - 1) * grid.spacingY / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dummy.position.set(
          col * grid.spacingX - centerX,
          row * grid.spacingY - centerY,
          0
        );
        dummy.updateMatrix();
        gridMesh.setMatrixAt(row * cols + col, dummy.matrix);
      }
    }
    gridMesh.instanceMatrix.needsUpdate = true;

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.3, 0.5, 0.0
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const clock = new THREE.Clock();

    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsedTime = clock.getElapsedTime() * 1000;
      barMaterial.uniforms.uTime.value = elapsedTime;
      composer.render();
      gridMesh.rotation.y = Math.sin(elapsedTime * 0.0002) * 0.05;
    }

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      barMaterial.uniforms.uMouse.value.x = mouseX * (frustumSize / 2) * aspect;
      barMaterial.uniforms.uMouse.value.y = mouseY * frustumSize / 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = container.offsetWidth || window.innerWidth;
      const h = container.offsetHeight || window.innerHeight;
      const a = w / h;

      camera.left = -a * frustumSize / 2;
      camera.right = a * frustumSize / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    if (fadeIn) {
      renderer.domElement.style.opacity = '0';
      const fadeInInterval = setInterval(() => {
        const current = parseFloat(renderer.domElement.style.opacity || '0');
        if (current < 1) {
          renderer.domElement.style.opacity = String(Math.min(current + 0.01, 1));
        } else {
          clearInterval(fadeInInterval);
        }
      }, 20);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      barGeometry.dispose();
      barMaterial.dispose();
      renderer.dispose();
      composer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fadeIn]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
}
