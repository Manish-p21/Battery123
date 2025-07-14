import React, { useRef, useState, useEffect } from 'react';

function BatteryModel({ mouse }) {
  const modelRef = useRef();

  useEffect(() => {
    const updateRotation = () => {
      if (modelRef.current) {
        const targetRotationY = mouse.x * 45;
        const targetRotationX = -mouse.y * 30;
        const currentRotationY = parseFloat(modelRef.current.style.getPropertyValue('--rotateY')) || 0;
        const currentRotationX = parseFloat(modelRef.current.style.getPropertyValue('--rotateX')) || 0;

        const lerp = (start, end, t) => start + (end - start) * t;
        const newRotationY = lerp(currentRotationY, targetRotationY, 0.1);
        const newRotationX = lerp(currentRotationX, targetRotationX, 0.1);

        modelRef.current.style.setProperty('--rotateY', `${newRotationY}deg`);
        modelRef.current.style.setProperty('--rotateX', `${newRotationX}deg`);
      }
      requestAnimationFrame(updateRotation);
    };
    updateRotation();
  }, [mouse]);

  return (
    <div
      ref={modelRef}
      className="battery-model"
      style={{
        transform: 'perspective(1000px) translate(-50%, -50%) rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg)) scale(1.2)',
        transformStyle: 'preserve-3d',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: 'center',
        width: '200px',
        height: '300px',
        backgroundImage: 'ur[](https://res.cloudinary.com/dn17q5qma/image/upload/v1752434681/battery_npjqjw.glb)', // Temporary placeholder, replace with your image
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'drop-shadow(0 0 20px rgba(0, 255, 204, 0.5))',
        transition: 'filter 0.1s ease',
      }}
    />
  );
}

function SceneLights({ mouse }) {
  const lightRef = useRef();

  useEffect(() => {
    const updateLight = () => {
      const time = performance.now() * 0.001;
      const intensity = 1 + Math.sin(time) * 0.3;
      if (lightRef.current) {
        lightRef.current.style.setProperty('--lightX', `${mouse.x * 3}rem`);
        lightRef.current.style.setProperty('--lightY', `${-mouse.y * 3 + 2}rem`);
        lightRef.current.style.setProperty('--intensity', intensity);
      }
      requestAnimationFrame(updateLight);
    };
    updateLight();
  }, [mouse]);

  return (
    <div
      ref={lightRef}
      className="scene-light"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at var(--lightX, 50%) var(--lightY, 50%), rgba(0, 255, 204, var(--intensity, 0.7)), transparent 50%)',
        pointerEvents: 'none',
      }}
    />
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
    resizeCanvas();
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
        }
        ctx.stroke();
        ctx.closePath();
      }
      animationFrameId = requestAnimationFrame(drawLightning);
    }

    drawLightning();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-10"
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
      className="relative overflow-hidden backdrop-blur-md bg-white/10 border border-gray-200 rounded-lg p-6"
      onMouseEnter={handleMouseEnter}
    >
      {ripples.map((ripple, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-gray-200/20 pointer-events-none"
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
      className="relative bg-gradient-to-r from-teal-200 to-white min-h-screen flex flex-col justify-between px-8 pt-8 pb-4 rounded-[20px] shadow-inner overflow-hidden font-poppins"
      onMouseMove={handleMouseMove}
      style={{ background: 'linear-gradient(to right, #a3e4d7, #ffffff)' }} // Matches the uploaded image gradient
    >
      {/* Lightning Background */}
      <LightningBackground />

      {/* Header */}
      <nav className="flex justify-between items-center z-10 mb-6">
        <div className="text-gray-800 text-2xl font-bold">A</div>
        <div className="flex items-center space-x-4">
          <a href="#shop" className="text-gray-600 text-sm hover:text-gray-800">Shop</a>
          <a href="#features" className="text-gray-600 text-sm hover:text-gray-800">Features</a>
          <div className="text-gray-800">●</div>
        </div>
      </nav>

      {/* 3D-like Model and Lighting */}
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(255, 255, 255, 0.1)' }}> {/* Slight background to help visibility */}
        <SceneLights mouse={mouse} />
        <BatteryModel mouse={mouse} />
      </div>

      {/* Text over 3D */}
      <div className="z-10 flex justify-between items-center h-[300px]">
        <div className="text-gray-800 font-mono text-6xl md:text-8xl tracking-widest animate-pulse">
          B A T T
        </div>
        <div className="text-gray-800 font-mono text-6xl md:text-8xl tracking-widest animate-pulse">
          E R Y
        </div>
      </div>

      {/* Bottom Footer Text */}
      <div className="z-10 grid grid-cols-2 gap-4">
        <WaterRippleEffect>
          <div>
            <p className="text-sm text-gray-500 uppercase">Pocket</p>
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
              REDEFINING NOSTALGIA.
              <br />
              ELEVATING PLAY.
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Experience the ultimate portable power with cutting-edge technology.
            </p>
          </div>
        </WaterRippleEffect>
        <WaterRippleEffect>
          <div className="text-right">
            <p className="text-xs text-gray-500">Features</p>
            <h3 className="text-lg font-semibold text-gray-800">Unmatched Display</h3>
            <p className="text-sm text-gray-600">
              Play your favorites on a stunning LCD screen with razor-sharp resolution.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mt-4">Long-Lasting Power</h3>
            <p className="text-sm text-gray-600">
              Up to 48 hours of continuous use on a single charge.
            </p>
          </div>
        </WaterRippleEffect>
      </div>
    </div>
  );
};

export default Hero;