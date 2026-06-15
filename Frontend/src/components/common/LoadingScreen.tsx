import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";

type LoadingScreenProps = {
  onComplete?: () => void;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Split text into individual characters for staggered animation
    const textEl = textRef.current;
    if (textEl) {
      const text = textEl.textContent || "";
      textEl.innerHTML = text
        .split("")
        .map((char) => {
          if (char === " ") return `<span class="inline-block w-4">&nbsp;</span>`;
          return `<span class="letter inline-block opacity-0 translate-y-[50px] scale-50 filter blur-[4px] font-black">${char}</span>`;
        })
        .join("");
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      },
    });

    // 1. Initial screen fade-in + background glow pulse
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.3,
    });

    // 2. Logo icon pop and spin
    tl.fromTo(
      logoRef.current,
      { scale: 0, rotate: -180, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );

    // 3. Pulse the logo glow
    tl.to(logoRef.current, {
      boxShadow: "0 0 50px 15px rgba(99, 102, 241, 0.6)",
      duration: 0.4,
      yoyo: true,
      repeat: 1,
    });

    // 4. Staggered reveal of characters
    tl.to(
      ".letter",
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.05,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // 5. Letter space expand and soft slide up
    tl.to(".letter", {
      letterSpacing: "4px",
      color: "#a855f7",
      duration: 0.5,
      ease: "power2.inOut",
    });

    // 6. Final slide up and fade out of the screen
    tl.to(containerRef.current, {
      y: "-100%",
      opacity: 0,
      duration: 0.7,
      ease: "power4.inOut",
      delay: 0.4,
    });

  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />

      <div className="flex flex-col items-center gap-6 z-10">
        {/* Animated Logo Container */}
        <div
          ref={logoRef}
          className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 shadow-2xl shadow-indigo-500/30 text-white flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <Sparkles size={48} className="animate-pulse" />
        </div>

        {/* Brand Name Text */}
        <h1
          ref={textRef}
          className="text-4xl md:text-5xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-400 select-none pb-2 mt-4"
        >
          Vabtic Resume
        </h1>

        {/* Small subtitle indicator */}
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-indigo-400/80 animate-pulse mt-1 select-none">
          Loading Premium Workspace...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
