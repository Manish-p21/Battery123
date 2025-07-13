import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function BatteryModel({ mouse }) {
  const gltf = useGLTF('https://res.cloudinary.com/dn17q5qma/image/upload/v1752434681/battery_npjqjw.glb', true);
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        mouse.x * 0.5,
        0.1
      );
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        -mouse.y * 0.3,
        0.1
      );
    }
  });

  return (
    <Float floatIntensity={1} speed={1.5}>
      <group ref={modelRef} scale={1.2} position={[0, -1.5, 0]}>
        <primitive object={gltf.scene} />
      </group>
    </Float>
  );
}

function SceneLights({ mouse }) {
  const dirLight = useRef();

  useFrame(() => {
    const time = performance.now() * 0.001;
    const intensity = 1 + Math.sin(time) * 0.3;

    if (dirLight.current) {
      dirLight.current.position.x = mouse.x * 3;
      dirLight.current.position.y = -mouse.y * 3 + 2;
      dirLight.current.intensity = intensity;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={dirLight}
        position={[2, 3, 5]}
        intensity={1.5}
        color="#00ffcc"
        castShadow
      />
    </>
  );
}

function LightningBackground() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    canvas.height = window.innerHeight;
    window.addEventListener('resize', resizeCanvas);

    function drawLightning() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(107, 107, 107)';
        ctx.lineWidth = 3;
        let x = Math.random() * canvas.width;
        let y = 0;
        ctx.moveTo(x, y);
        while (y < canvas.height) {
          x += (Math.random() - 0.5) * 60;
          y += Math.random() * 60;
          ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        }
      }
      animationFrameId = requestAnimationFrame(drawLightning);
    };

    drawLightning();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-10" // Reduced opacity to blend with white background
    />
  );
}

function WaterRippleEffect({ children }) {
  const containerRef = useRef();
  const [ripples, setRipples] = useState([]);

  const handleMouseEnter = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples([...ripples, { x, y, size: 0, opacity: 1 }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples((prev) =>
        prev
          .map((ripple) => ({
            ...ripple,
            size: ripple.size + 5,
            opacity: ripple.opacity - 0.02,
          }))
          .filter((ripple) => ripple.opacity > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden backdrop-blur-md bg-white/10 border border-gray-200 rounded-lg p-6" // Updated border color
      onMouseEnter={handleMouseEnter}
    >
      {ripples.map((ripple, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-gray-200/20 pointer-events-none" // Adjusted ripple color
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            opacity: ripple.opacity,
          }}
        />
      ))}
      {children}
    </div>
  );
}

const Hero = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMouse({ x, y });
  };

  return (
    <div
      className="relative bg-white min-h-screen flex flex-col justify-between px-8 pt-8 pb-4 rounded-[20px] shadow-inner overflow-hidden font-poppins" // Updated background and font
      onMouseMove={handleMouseMove}
    >
      {/* Lightning Background */}
      <LightningBackground />

      {/* Header */}
      <nav className="flex justify-between items-center z-10 mb-6">
        <div className="text-gray-800 text-2xl font-bold">A</div> {/* Updated text color */}
        <div className="flex items-center space-x-4">
          <a href="#shop" className="text-gray-600 text-sm hover:text-gray-800">Shop</a> {/* Updated text colors */}
          <a href="#features" className="text-gray-600 text-sm hover:text-gray-800">Features</a>
          <div className="text-gray-800">●</div> {/* Updated dot color */}
        </div>
      </nav>

      {/* 3D Model Canvas */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 50, 100], fov: 35 }}>
            <Environment preset="city" />
            <SceneLights mouse={mouse} />
            <BatteryModel mouse={mouse} />
          </Canvas>
        </Suspense>
      </div>

      {/* Text over 3D */}
      <div className="z-10 flex justify-between items-center h-[300px]">
        <div className="text-gray-800 font-mono text-6xl md:text-8xl tracking-widest animate-pulse"> {/* Updated text color */}
          B A T T
        </div>
        <div className="text-gray-800 font-mono text-6xl md:text-8xl tracking-widest animate-pulse"> {/* Updated text color */}
          E R Y
        </div>
      </div>

      {/* Bottom Footer Text */}
      <div className="z-10 grid grid-cols-2 gap-4">
        <WaterRippleEffect>
          <div>
            <p className="text-sm text-gray-500 uppercase">Pocket</p> {/* Updated text color */}
            <h2 className="text-xl font-semibold leading-tight text-gray-800"> {/* Updated text color */}
              REDEFINING NOSTALGIA.
              <br />
              ELEVATING PLAY.
            </h2>
            <p className="text-sm text-gray-600 mt-2"> {/* Updated text color */}
              Experience the ultimate portable power with cutting-edge technology.
            </p>
          </div>
        </WaterRippleEffect>
        <WaterRippleEffect>
          <div className="text-right">
            <p className="text-xs text-gray-500">Features</p> {/* Updated text color */}
            <h3 className="text-lg font-semibold text-gray-800">Unmatched Display</h3> {/* Updated text color */}
            <p className="text-sm text-gray-600"> {/* Updated text color */}
              Play your favorites on a stunning LCD screen with razor-sharp resolution.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mt-4">Long-Lasting Power</h3> {/* Updated text color */}
            <p className="text-sm text-gray-600"> {/* Updated text color */}
              Up to 48 hours of continuous use on a single charge.
            </p>
          </div>
        </WaterRippleEffect>
      </div>
    </div>
  );
};

export default Hero;