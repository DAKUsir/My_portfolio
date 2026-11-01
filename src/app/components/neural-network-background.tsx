"use client";

import { useEffect, useRef } from "react";

type Neuron = {
  x: number;
  y: number;
  depth: number;
  radius: number;
  phase: number;
  driftX: number;
  driftY: number;
  color: readonly [number, number, number];
};

type Point = { x: number; y: number };

const neuronColors = [
  [39, 105, 120],
  [56, 112, 145],
  [111, 102, 151],
  [174, 121, 83],
] as const;

export function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let scrollProgress = 0;
    let animationFrame = 0;
    let lastDraw = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let neurons: Neuron[] = [];
    let seed = 190731;
    let pointerActive = false;
    const pointer: Point = { x: 0, y: 0 };
    const pointerTarget: Point = { x: 0, y: 0 };

    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const wrap = (value: number, max: number) => ((value % max) + max) % max;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.round(Math.min(185, Math.max(82, (width * height) / 8200)));
      neurons = Array.from({ length: count }, () => ({
        x: random(),
        y: random(),
        depth: 0.25 + random() * 0.75,
        radius: random() > 0.92 ? 2.1 + random() * 0.9 : 1 + random() * 1.1,
        phase: random() * Math.PI * 2,
        driftX: (random() - 0.5) * 8,
        driftY: (random() - 0.5) * 3,
        color: neuronColors[Math.floor(random() * neuronColors.length)],
      }));
    };

    const draw = (time: number) => {
      animationFrame = 0;
      if (!reducedMotion && time - lastDraw < 32) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;

      const elapsed = reducedMotion ? 0 : time / 1000;
      const progress = reducedMotion ? 0 : scrollProgress;
      const scrollShift = progress * height * 0.86;

      context.fillStyle = "#e5edef";
      context.fillRect(0, 0, width, height);

      const atmosphere = context.createLinearGradient(0, 0, width, height);
      atmosphere.addColorStop(0, "rgba(91, 157, 170, 0.17)");
      atmosphere.addColorStop(0.48, "rgba(229, 237, 239, 0)");
      atmosphere.addColorStop(1, "rgba(151, 132, 181, 0.13)");
      context.fillStyle = atmosphere;
      context.fillRect(0, 0, width, height);

      const glows = [
        { x: width * 0.18, y: height * 0.28, color: "rgba(70, 148, 160, 0.16)" },
        { x: width * 0.82, y: height * 0.72, color: "rgba(139, 119, 171, 0.14)" },
      ];
      for (const glow of glows) {
        const gradient = context.createRadialGradient(
          glow.x,
          glow.y,
          0,
          glow.x,
          glow.y,
          Math.max(width, height) * 0.42,
        );
        gradient.addColorStop(0, glow.color);
        gradient.addColorStop(1, "rgba(229, 237, 239, 0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }

      context.beginPath();
      context.strokeStyle = "rgba(37, 82, 98, 0.05)";
      context.lineWidth = 1;
      const gridSize = 58;
      for (let x = 0; x <= width; x += gridSize) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      const pointerEase = reducedMotion ? 1 : 0.12;
      pointer.x += (pointerTarget.x - pointer.x) * pointerEase;
      pointer.y += (pointerTarget.y - pointer.y) * pointerEase;

      const positions: Point[] = neurons.map((neuron) => {
        const phase = elapsed * 0.24 + neuron.phase;
        let x = wrap(
          neuron.x * width + Math.sin(phase) * 11 * neuron.depth + elapsed * neuron.driftX,
          width,
        );
        let y = wrap(
          neuron.y * height - scrollShift * neuron.depth + Math.cos(phase * 0.83) * 10 + elapsed * neuron.driftY,
          height,
        );

        if (pointerActive && !reducedMotion) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - distance / 260) * 0.085;
          x = wrap(x + dx * influence, width);
          y = wrap(y + dy * influence, height);
        }

        return { x, y };
      });

      const connectionDistance = Math.min(145, Math.max(92, width * 0.095)) + progress * 24;
      const connectionDistanceSquared = connectionDistance * connectionDistance;

      context.lineWidth = 0.8;
      for (let i = 0; i < neurons.length; i += 1) {
        const start = positions[i];
        for (let j = i + 1; j < neurons.length; j += 1) {
          const end = positions[j];
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > connectionDistanceSquared) continue;

          const distance = Math.sqrt(distanceSquared);
          const fade = 1 - distance / connectionDistance;
          const pulse = reducedMotion ? 0 : (Math.sin(elapsed * 1.1 + i * 0.13 + j * 0.07) + 1) * 0.035;
          const alpha = Math.min(0.42, (0.14 + fade * 0.24 + pulse) * (0.95 + progress * 0.35));
          context.beginPath();
          context.strokeStyle = `rgba(39, 91, 108, ${alpha})`;
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
          context.stroke();

          if (!reducedMotion && (i + j) % 19 === 0) {
            const signal = (elapsed * 0.16 + (i * 0.17 + j * 0.11)) % 1;
            const signalX = start.x + dx * signal;
            const signalY = start.y + dy * signal;
            context.beginPath();
            context.fillStyle = "rgba(190, 124, 82, 0.68)";
            context.arc(signalX, signalY, 1.25, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      if (pointerActive && !reducedMotion) {
        const pointerRadius = 220;
        for (let index = 0; index < positions.length; index += 1) {
          const position = positions[index];
          const distance = Math.hypot(pointer.x - position.x, pointer.y - position.y);
          if (distance > pointerRadius) continue;
          const alpha = (1 - distance / pointerRadius) * 0.42;
          context.beginPath();
          context.strokeStyle = `rgba(44, 117, 132, ${alpha})`;
          context.lineWidth = 1;
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(position.x, position.y);
          context.stroke();
        }

        const pointerGlow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 30);
        pointerGlow.addColorStop(0, "rgba(73, 150, 160, 0.25)");
        pointerGlow.addColorStop(1, "rgba(73, 150, 160, 0)");
        context.fillStyle = pointerGlow;
        context.fillRect(pointer.x - 30, pointer.y - 30, 60, 60);
        context.beginPath();
        context.strokeStyle = "rgba(48, 112, 127, 0.34)";
        context.lineWidth = 0.8;
        context.arc(pointer.x, pointer.y, 10 + Math.sin(elapsed * 2) * 1.5, 0, Math.PI * 2);
        context.stroke();
      }

      for (let index = 0; index < neurons.length; index += 1) {
        const neuron = neurons[index];
        const position = positions[index];
        const shimmer = reducedMotion ? 0.72 : 0.66 + (Math.sin(elapsed * 1.15 + neuron.phase) + 1) * 0.12;
        const [red, green, blue] = neuron.color;
        const radius = neuron.radius * (pointerActive && !reducedMotion && Math.hypot(pointer.x - position.x, pointer.y - position.y) < 150 ? 1.35 : 1);

        if (radius > 2.1) {
          context.beginPath();
          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.13 * shimmer})`;
          context.arc(position.x, position.y, radius * 3.4, 0, Math.PI * 2);
          context.fill();
        }

        context.beginPath();
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.62 * shimmer})`;
        context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      canvas.classList.add("is-ready");
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const requestDraw = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(draw);
    };

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      if (reducedMotion) requestDraw();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerTarget.x = event.clientX;
      pointerTarget.y = event.clientY;
      pointerActive = true;
      if (reducedMotion) return;
      requestDraw();
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      pointerActive = false;
      if (reducedMotion) requestDraw();
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      lastDraw = 0;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(draw);
    };

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    resize();
    updateScroll();
    requestDraw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("resize", requestDraw, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    motionPreference.addEventListener("change", onMotionPreferenceChange);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", requestDraw);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      motionPreference.removeEventListener("change", onMotionPreferenceChange);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="neural-field-backdrop" aria-hidden="true">
      <canvas className="neural-field-canvas" ref={canvasRef} />
      <div className="neural-field-wash" />
      <div className="neural-field-grain" />
    </div>
  );
}
