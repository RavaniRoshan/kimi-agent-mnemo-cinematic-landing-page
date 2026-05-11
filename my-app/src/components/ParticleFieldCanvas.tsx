import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useWebGLVisibility } from '../hooks/useWebGLVisibility';

const particleVertexShader = `
  uniform float time;
  uniform float speed;
  uniform vec2 mouse;
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    vec3 pos = position;
    pos.x += sin(time * speed + pos.y) * 0.2;
    pos.y += cos(time * speed + pos.x) * 0.2;
    pos.z += sin(time * speed + pos.z) * 0.2;
    float mouseInfluence = length(mouse - pos.xy);
    pos.z -= mouseInfluence * 0.1;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.5 + 0.5 * sin(time + pos.x);
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = (0.5 - dist) * 2.0 * vAlpha;
    if (alpha <= 0.0) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function ParticleFieldCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useWebGLVisibility(containerRef);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.095);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x3B3BFF, 1, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    const particleCount = 3000;
    const spread = 25;
    const speed = 0.4;
    // waveAmplitude used for scroll-driven displacement in design spec

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const initialPositions = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x1B2B40);
    const color2 = new THREE.Color(0x3B3BFF);
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread * 0.5;
      const z = (Math.random() - 0.5) * spread;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      const t = i / particleCount;
      tempColor.copy(color1).lerp(color2, t);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;

      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        speed: { value: speed },
        mouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();

    let animId: number;

    function tick() {
      animId = requestAnimationFrame(tick);

      if (!isVisibleRef.current) return;

      particleMaterial.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }

    tick();

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / width) * 2 - 1;
      const mouseY = -(e.clientY / height) * 2 + 1;
      particleMaterial.uniforms.mouse.value.set(mouseX * 10, mouseY * 10);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = container.offsetWidth || window.innerWidth;
      const h = container.offsetHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

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
