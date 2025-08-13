import React from "react";

const LoadingPage = () => {
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Embedded CSS for animations */}
      <style>
        {`
          @keyframes verticalBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-80px); }
          }

          @keyframes lineWave {
            0%, 100% { transform: scaleY(1); }
            40% { transform: scaleY(1.4); }
            60% { transform: scaleY(0.8); }
          }

          .bouncing-ball {
            width: 50px;
            height: 50px;
            background-color: #22c55e; /* Tailwind red-500 */
            border-radius: 9999px;
            animation: verticalBounce 1s infinite ease-in-out;
            box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
          }

          .bouncing-line {
            width: 120px;
            height: 4px;
            background-color: #d1d5db; /* Tailwind gray-300 */
            animation: lineWave 1s infinite ease-in-out;
            transform-origin: center;
          }
        `}
      </style>

      {/* Ball */}
      <div className="flex flex-col items-center gap-6">
        <div className="bouncing-ball"></div>
        <div className="bouncing-line"></div>

        {/* Loading Text */}
        <div className="text-center mt-6">
          <h2 className="text-red-600 text-lg font-semibold animate-pulse">
            Serving your experience...
          </h2>
          <p className="text-sm text-gray-500">Hang tight, loading in progress</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
