import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useMusic } from '@/contexts/MusicContext';

interface VisualizerProps {
  className?: string;
  color?: string;
  barCount?: number;
}

export function VisualEqualizer({ 
  className,
  color = "primary",
  barCount = 32
}: VisualizerProps) {
  const { isPlaying } = useMusic();
  const [bars, setBars] = useState<number[]>([]);
  const requestRef = useRef<number>();
  
  // Renkler için sınıf adları belirleme
  const colorClass = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    gradient: "bg-gradient-to-t from-primary to-indigo-400"
  }[color] || "bg-primary";

  // Çubuklara değer atama
  useEffect(() => {
    // Çubuk sayısına göre başlangıç değerleri oluştur
    const initialBars = Array(barCount).fill(0).map(() => Math.random() * 0.3);
    setBars(initialBars);
    
    const animate = () => {
      if (!isPlaying) {
        // Çalma durmuşsa, hafifçe hareket ettir
        setBars(prev => prev.map(value => {
          const change = (Math.random() - 0.5) * 0.05;
          return Math.max(0.05, Math.min(0.3, value + change));
        }));
      } else {
        // Çalarken daha aktif hareket et
        setBars(prev => prev.map(value => {
          const change = (Math.random() - 0.3) * 0.3;
          return Math.max(0.1, Math.min(0.95, value + change));
        }));
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div className={cn("flex items-end justify-between h-16 overflow-hidden", className)}>
      {bars.map((height, index) => (
        <div 
          key={index}
          className={cn("w-1 md:w-1.5 rounded-t-sm transition-all duration-75", colorClass)}
          style={{ height: `${height * 100}%` }} 
        />
      ))}
    </div>
  );
}

interface WaveformProps {
  className?: string;
  color?: string;
  height?: number;
}

export function WaveVisualizer({
  className,
  color = "primary",
  height = 80
}: WaveformProps) {
  const { isPlaying } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [amplitude, setAmplitude] = useState(1);
  
  // Renkler için değerler
  const colorValues = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    pink: '#ec4899',
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308'
  }[color] || 'hsl(var(--primary))';
  
  // Amplitüde bağlı animasyonu güncelleme
  useEffect(() => {
    // Müzik çalarken amplitüd'ü artır, durduğunda azalt
    const interval = setInterval(() => {
      if (isPlaying) {
        setAmplitude(prev => Math.min(5, prev + 0.2));
      } else {
        setAmplitude(prev => Math.max(0.5, prev - 0.2));
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  // Dalgaformu çizimi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Canvas boyutları ayarlama
    const width = canvas.width;
    const amplitude = height / 2;
    
    const drawWaveform = () => {
      if (!ctx) return;
      
      // Canvası temizle
      ctx.clearRect(0, 0, width, height);
      
      // Dalga çizimi
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      const time = Date.now() / 1000;
      const frequency = isPlaying ? 2 : 1;
      
      for (let x = 0; x < width; x++) {
        // Farklı frekanslarda sinüs dalgaları ekleyin
        const y1 = Math.sin(x * 0.02 + time * frequency) * amplitude * 0.3;
        const y2 = Math.sin(x * 0.04 + time * (frequency * 0.8)) * amplitude * 0.2;
        const y3 = Math.sin(x * 0.01 + time * (frequency * 1.2)) * amplitude * 0.1;
        
        // Dalgaların toplamı
        const y = height / 2 + (y1 + y2 + y3) * (isPlaying ? amplitude / 4 : amplitude / 8);
        
        ctx.lineTo(x, y);
      }
      
      // Dalga altını doldur
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      // Gradient dolgu
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `${colorValues}99`);  // Yarı-şeffaf ana renk
      gradient.addColorStop(1, `${colorValues}11`);  // Daha şeffaf
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Dalgayı çiz
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      for (let x = 0; x < width; x++) {
        const y1 = Math.sin(x * 0.02 + time * frequency) * amplitude * 0.3;
        const y2 = Math.sin(x * 0.04 + time * (frequency * 0.8)) * amplitude * 0.2;
        const y3 = Math.sin(x * 0.01 + time * (frequency * 1.2)) * amplitude * 0.1;
        
        const y = height / 2 + (y1 + y2 + y3) * (isPlaying ? amplitude / 4 : amplitude / 8);
        
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = colorValues;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      requestRef.current = requestAnimationFrame(drawWaveform);
    };
    
    requestRef.current = requestAnimationFrame(drawWaveform);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, height, colorValues]);
  
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={height}
        className="w-full h-auto"
      />
    </div>
  );
}

interface CircleVisualizerProps {
  className?: string;
  size?: number;
  color?: string;
}

export function CircleVisualizer({
  className,
  size = 200,
  color = "primary"
}: CircleVisualizerProps) {
  const { isPlaying } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Renkler için değerler
  const colorValues = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    pink: '#ec4899',
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308'
  }[color] || 'hsl(var(--primary))';
  
  // Dairesel vizüalizasyon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const circleRadius = size / 2 * 0.8;
    const center = size / 2;
    
    let rotation = 0;
    const numPoints = 100;
    const points: { distance: number, angle: number }[] = [];
    
    // Rastgele noktalar oluştur
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const distance = circleRadius * (0.8 + Math.random() * 0.2);
      points.push({ distance, angle });
    }
    
    const drawCircle = () => {
      if (!ctx) return;
      
      // Canvası temizle
      ctx.clearRect(0, 0, size, size);
      
      // Dış çerçeve
      ctx.beginPath();
      ctx.arc(center, center, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `${colorValues}33`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Noktaları birleştirerek path oluştur
      ctx.beginPath();
      
      // Rotasyon güncelle
      rotation += isPlaying ? 0.005 : 0.002;
      
      // İlk noktaya git
      const firstPoint = points[0];
      const distOffset = isPlaying ? Math.sin(Date.now() / 200) * 10 : 0;
      const x1 = center + (firstPoint.distance + distOffset) * Math.cos(firstPoint.angle + rotation);
      const y1 = center + (firstPoint.distance + distOffset) * Math.sin(firstPoint.angle + rotation);
      ctx.moveTo(x1, y1);
      
      // Diğer noktaları bağla
      for (let i = 1; i <= points.length; i++) {
        const point = points[i % points.length];
        const time = Date.now() / 1000;
        const frequency = isPlaying ? 4 : 2;
        
        // Çalma durumuna göre mesafe değişikliği
        const distOffset = 
          isPlaying ? 
          Math.sin(point.angle * frequency + time) * 15 : 
          Math.sin(point.angle * frequency + time) * 5;
        
        const x = center + (point.distance + distOffset) * Math.cos(point.angle + rotation);
        const y = center + (point.distance + distOffset) * Math.sin(point.angle + rotation);
        
        // Önceki noktayla eğrisel birleştirme
        const prevPoint = points[(i - 1) % points.length];
        const prevX = center + (prevPoint.distance + distOffset) * Math.cos(prevPoint.angle + rotation);
        const prevY = center + (prevPoint.distance + distOffset) * Math.sin(prevPoint.angle + rotation);
        
        const cpX1 = prevX + (x - prevX) * 0.5 - (y - prevY) * 0.2;
        const cpY1 = prevY + (y - prevY) * 0.5 + (x - prevX) * 0.2;
        
        ctx.quadraticCurveTo(cpX1, cpY1, x, y);
      }
      
      ctx.closePath();
      
      // Gradient dolgu
      const gradient = ctx.createRadialGradient(
        center, center, 0,
        center, center, circleRadius
      );
      gradient.addColorStop(0, `${colorValues}50`); // Merkez - yarı şeffaf
      gradient.addColorStop(1, `${colorValues}05`); // Kenar - çok şeffaf
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Parlaklık ayarı 
      ctx.strokeStyle = colorValues;
      ctx.lineWidth = isPlaying ? 2 : 1;
      ctx.stroke();
      
      // İç çember
      ctx.beginPath();
      ctx.arc(center, center, circleRadius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `${colorValues}${isPlaying ? '40' : '20'}`;
      ctx.fill();
      
      // Merkez nokta
      ctx.beginPath();
      ctx.arc(center, center, circleRadius * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = colorValues;
      ctx.fill();
      
      requestRef.current = requestAnimationFrame(drawCircle);
    };
    
    requestRef.current = requestAnimationFrame(drawCircle);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, size, colorValues]);
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        className="max-w-full h-auto"
      />
    </div>
  );
}