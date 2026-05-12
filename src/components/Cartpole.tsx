"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function Cartpole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Physics parameters
    const gravity = 9.81;
    const masscart = 1.0;
    const masspole = 0.1;
    const total_mass = masscart + masspole;
    const length = 0.5; // half the pole's length
    const polemass_length = masspole * length;
    let dt = 0.02; // simulation time step

    // State
    let x = 0; // Start at center
    let x_dot = 0;
    let theta = 0; // Perfectly balanced at start
    let theta_dot = 0;

    // Optimal LQR Gains for cartpole
    const k_x = -3.16;
    const k_v = -6.32;
    const k_theta = -57.32;
    const k_omega = -17.62;

    let animationFrameId: number;
    let lastTime = 0;
    let nextJerkTime = 0;
    let ballSpawnedForJerk = false;

    type Ball = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      state: 'incoming' | 'falling';
      radius: number;
      hitTime?: number;
      impulse?: number;
      startX?: number;
      startY?: number;
      totalTime?: number;
    };
    let balls: Ball[] = [];

    const spawnIncomingBall = (targetTime: number, currentTime: number, impulse: number) => {
      const timeToHit = (targetTime - currentTime) / 1000;
      if (timeToHit <= 0) return;
      
      const hitX = width / 2 + x * (width / 4.8) + Math.sin(theta) * 60; // Aim near pole tip
      const hitY = height - 70;
      
      // If impulse > 0 (push pole right), ball must come from the LEFT
      const startX = impulse > 0 ? hitX - 250 : hitX + 250; 
      
      balls.push({
        x: 0, // dynamically calculated in update loop
        y: 0,
        vx: 0,
        vy: 0,
        state: 'incoming',
        radius: 4.5,
        hitTime: targetTime,
        impulse: impulse,
        startX: startX,
        startY: hitY,
        totalTime: timeToHit
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const scale = width / 4.8;
      const cartY = height - 30;
      const cartX = width / 2 + x * scale;
      const cartWidth = 40;
      const cartHeight = 20;

      // Draw track
      ctx.beginPath();
      ctx.moveTo(0, cartY + cartHeight / 2);
      ctx.lineTo(width, cartY + cartHeight / 2);
      ctx.strokeStyle = "rgba(150, 150, 150, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw cart
      ctx.fillStyle = "hsl(var(--primary))";
      ctx.fillRect(cartX - cartWidth / 2, cartY - cartHeight / 2, cartWidth, cartHeight);

      // Draw pole
      const poleDrawLength = 60;
      const poleEndX = cartX + Math.sin(theta) * poleDrawLength;
      const poleEndY = cartY - Math.cos(theta) * poleDrawLength;

      ctx.beginPath();
      ctx.moveTo(cartX, cartY);
      ctx.lineTo(poleEndX, poleEndY);
      ctx.strokeStyle = "hsl(var(--primary))";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw joint
      ctx.beginPath();
      ctx.arc(cartX, cartY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "hsl(var(--background))";
      ctx.fill();
      ctx.strokeStyle = "hsl(var(--primary))";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw balls
      balls.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, 2 * Math.PI);
        if (b.state === 'incoming') {
          ctx.fillStyle = "hsl(var(--destructive))";

          // Motion trail (pointing backwards to start)
          const dx = b.startX! - b.x;
          const dy = b.startY! - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const trailLen = 15;
          const trailX = dist > 0 ? b.x + (dx / dist) * trailLen : b.x;
          const trailY = dist > 0 ? b.y + (dy / dist) * trailLen : b.y;

          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "hsl(var(--destructive) / 0.5)";
          ctx.lineWidth = b.radius * 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = "hsl(var(--muted-foreground))";
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    const update = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
        nextJerkTime = time + 1000; // First ball hits at exactly 1s
        draw();
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      let frame_dt = (time - lastTime) / 1000;
      lastTime = time;
      if (frame_dt > 0.1) frame_dt = 0.1;

      // Spawning incoming balls
      if (time >= nextJerkTime - 800 && !ballSpawnedForJerk) {
        const impulse = (Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random());
        spawnIncomingBall(nextJerkTime, time, impulse);
        ballSpawnedForJerk = true;
      }

      // Schedule next event
      if (time >= nextJerkTime) {
        nextJerkTime = time + 8000;
        ballSpawnedForJerk = false;
      }

      // Physics constants for collision mapping
      const cartPixelX = width / 2 + x * (width / 4.8);
      const cartPixelVx = x_dot * (width / 4.8);
      const cartY = height - 30;
      const cartWidth = 40;
      const cartHeight = 20;
      const cartLeft = cartPixelX - cartWidth / 2;
      const cartRight = cartPixelX + cartWidth / 2;
      const cartTop = cartY - cartHeight / 2;
      const cartBottom = cartY + cartHeight / 2;
      const floorY = cartY + cartHeight / 2;

      // Update balls
      balls.forEach(b => {
        if (b.state === 'incoming') {
          const timeRemaining = (b.hitTime! - time) / 1000;
          if (timeRemaining <= 0) {
            // Check impact
            b.x = cartPixelX + Math.sin(theta) * 60; // Snap exactly to pole
            b.state = 'falling';
            b.vx = b.impulse! > 0 ? 80 : -80; // Bounce off slightly
            b.vy = -100; // Pop upwards
            theta_dot += b.impulse!; // Transfer energy to pole
            b.hitTime = undefined;
          } else {
            // Homing interpolation guarantees it tracks the pole exactly
            const currentHitX = cartPixelX + Math.sin(theta) * 60;
            const currentHitY = cartY - Math.cos(theta) * 60;
            const p = Math.max(0, timeRemaining / b.totalTime!);
            b.x = currentHitX + (b.startX! - currentHitX) * p;
            b.y = currentHitY + (b.startY! - currentHitY) * p;
          }
        } else if (b.state === 'falling') {
          b.vy += 400 * frame_dt; // Gravity (lowered for floaty debris)
          b.x += b.vx * frame_dt;
          b.y += b.vy * frame_dt;

          // Cart Collision (AABB with minimum penetration resolution)
          if (b.x + b.radius > cartLeft && b.x - b.radius < cartRight &&
            b.y + b.radius > cartTop && b.y - b.radius < cartBottom) {

            const distLeft = Math.abs((b.x + b.radius) - cartLeft);
            const distRight = Math.abs((b.x - b.radius) - cartRight);
            const distTop = Math.abs((b.y + b.radius) - cartTop);
            const minPenetration = Math.min(distLeft, distRight, distTop);

            if (minPenetration === distTop) {
              b.y = cartTop - b.radius;
              b.vy = b.vy > 0 ? -b.vy * 0.4 : b.vy;
              b.vx += cartPixelVx * 0.1;
            } else if (minPenetration === distLeft) {
              b.x = cartLeft - b.radius;
              b.vx = cartPixelVx < 0 ? cartPixelVx * 1.1 : -40;
            } else {
              b.x = cartRight + b.radius;
              b.vx = cartPixelVx > 0 ? cartPixelVx * 1.1 : 40;
            }
          }

          // Floor Collision (only if resting on the track)
          if (b.x > 0 && b.x < width) {
            if (b.y > floorY - b.radius) {
              b.y = floorY - b.radius;
              b.vy *= -0.4; // Bounce
              b.vx *= 0.95; // Friction
            }
          }
        }
      });

      // Cleanup balls out of bounds
      balls = balls.filter(b => b.y < height + 100);

      // Cartpole Physics sub-stepping
      const num_steps = Math.max(1, Math.floor(frame_dt / 0.01));
      const dt = frame_dt / num_steps;

      for (let i = 0; i < num_steps; i++) {
        let force = -(k_x * x + k_v * x_dot + k_theta * theta + k_omega * theta_dot);
        if (force > 50) force = 50;
        if (force < -50) force = -50;

        const costheta = Math.cos(theta);
        const sintheta = Math.sin(theta);

        const temp = (force + polemass_length * theta_dot * theta_dot * sintheta) / total_mass;
        const thetaacc = (gravity * sintheta - costheta * temp) / (length * (4.0 / 3.0 - masspole * costheta * costheta / total_mass));
        const xacc = temp - polemass_length * thetaacc * costheta / total_mass;

        x += x_dot * dt;
        x_dot += xacc * dt;
        theta += theta_dot * dt;
        theta_dot += thetaacc * dt;

        if (x < -2.4) {
          x = -2.4;
          x_dot = -x_dot * 0.5;
        } else if (x > 2.4) {
          x = 2.4;
          x_dot = -x_dot * 0.5;
        }

        if (Math.abs(theta) > Math.PI / 2) {
          x = 0;
          x_dot = 0;
          theta = 0;
          theta_dot = 0;
        }
      }

      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const cartPixelX = width / 2 + x * (width / 4.8);
      
      // Determine kick direction based on click
      let kick = clickX < cartPixelX ? 3.0 : -3.0;

      // Spawn an incoming ball from the cursor to the pole
      const timeToHit = 0.2; // 200ms flight time
      balls.push({
        x: clickX,
        y: clickY,
        vx: 0,
        vy: 0,
        state: 'incoming',
        radius: 4.5,
        hitTime: lastTime + timeToHit * 1000,
        impulse: kick,
        startX: clickX,
        startY: clickY,
        totalTime: timeToHit
      });
    };

    canvas.addEventListener("pointerdown", handlePointerDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-auto pt-8 pb-4 w-full flex flex-col items-center"
    >
      <div className="w-full flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">LQR</span>
        <span className="text-[10px] text-muted-foreground/40 bg-muted px-1.5 py-0.5 rounded">Interactive</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[120px] rounded-xl bg-card border border-border/50 cursor-crosshair shadow-sm"
        style={{ touchAction: "none" }}
      />
    </motion.div>
  );
}
