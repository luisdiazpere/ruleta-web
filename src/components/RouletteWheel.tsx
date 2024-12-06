import React, { useEffect, useRef } from 'react';
import { RouletteOption } from '../types/roulette';

interface RouletteWheelProps {
  options: RouletteOption[];
  spinning: boolean;
  selectedOption: RouletteOption | null;
  onSpin: () => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
  '#E74C3C', '#2ECC71', '#F1C40F', '#1ABC9C'
];

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  options,
  spinning,
  selectedOption,
  onSpin,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const spinningTimeoutRef = useRef<NodeJS.Timeout>();

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2 * 0.9;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (options.length === 0) {
      // Draw empty wheel
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }

    const sliceAngle = (2 * Math.PI) / options.length;

    options.forEach((option, i) => {
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        i * sliceAngle,
        (i + 1) * sliceAngle
      );
      ctx.closePath();

      // Fill slice
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(option.text, radius - 10, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel();
  }, [options]);

  useEffect(() => {
    if (spinning) {
      const spinDuration = 2000;
      const startTime = Date.now();
      const startRotation = rotationRef.current;
      const totalRotations = 5; // Number of full rotations
      const endRotation = startRotation + (360 * totalRotations) + (Math.random() * 360);

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function for smooth deceleration
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const currentRotation = startRotation + (endRotation - startRotation) * easeOut(progress);

        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${currentRotation}deg)`;
          rotationRef.current = currentRotation;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [spinning]);

  return (
    <div className="relative w-[500px] h-[500px]">
      {selectedOption && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-10">
          <p className="text-xl font-bold">{selectedOption.text}</p>
        </div>
      )}

      <div className="relative w-full h-full">
        {/* Pointer */}
        <div className="absolute w-8 h-8 left-1/2 -top-4 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500"></div>
        </div>

        {/* Wheel Container */}
        <div
          ref={wheelRef}
          className="absolute inset-0 transition-transform duration-100"
          style={{ transformOrigin: 'center center' }}
        >
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full h-full"
          />
        </div>

        {/* Center Button */}
        <button
          onClick={onSpin}
          disabled={spinning || options.length === 0}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20
            w-24 h-24 rounded-full bg-white shadow-lg border-4 border-purple-600
            text-purple-600 font-bold hover:bg-purple-50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200"
        >
          SPIN
        </button>
      </div>
    </div>
  );
};