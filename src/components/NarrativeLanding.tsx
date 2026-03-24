"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function NarrativeLanding({
  tocCount,
  claimCount,
  gapPercent,
  downstreamBreakPercent,
}: {
  tocCount: number;
  claimCount: number;
  gapPercent: number;
  downstreamBreakPercent: number;
}) {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-6 overflow-hidden">
      {/* Solid background */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--background)" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.02,
          backgroundImage:
            "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto w-full text-left"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Section label */}
        <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
          <span
            className="text-xs tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              color: "var(--accent)",
            }}
          >
            &sect; 01
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--accent)", opacity: 0.4 }}
          >
            &mdash;
          </span>
          <span
            className="text-xs tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              color: "var(--accent)",
            }}
          >
            The Gap
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.1] mb-10"
          style={{
            fontFamily: "var(--font-display, 'Instrument Serif', serif)",
          }}
        >
          <span style={{ color: "var(--foreground)" }}>
            $300 billion flows into AI every year.
          </span>
          <br />
          <span style={{ color: "var(--accent)" }}>
            What impact is it actually having?
          </span>
        </motion.h1>

        {/* Ruled line + Subtext */}
        <motion.div variants={fadeUp}>
          <div className="ruled-line mb-6" />
          <p
            className="text-lg leading-relaxed max-w-2xl mb-14"
            style={{ color: "var(--muted)" }}
          >
            We traced {tocCount} causal chains from AI investment to real-world
            impact. In {downstreamBreakPercent}% of them, the chain breaks before it
            reaches the people who need it most.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-0 mb-16"
        >
          {/* Theories of Change */}
          <div className="pr-8 md:pr-12">
            <div
              className="text-3xl"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                color: "var(--foreground)",
              }}
            >
              <AnimatedNumber value={tocCount} />
            </div>
            <div
              className="mt-2 text-[10px] tracking-[0.15em] uppercase"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                color: "var(--muted)",
              }}
            >
              Theories of Change
            </div>
          </div>

          {/* Causal Claims */}
          {claimCount > 0 && (
            <div
              className="px-8 md:px-12"
              style={{ borderLeft: "1px solid var(--border)" }}
            >
              <div
                className="text-3xl"
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  color: "var(--foreground)",
                }}
              >
                <AnimatedNumber value={claimCount} />
              </div>
              <div
                className="mt-2 text-[10px] tracking-[0.15em] uppercase"
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  color: "var(--muted)",
                }}
              >
                Causal Claims
              </div>
            </div>
          )}

          {/* Underinvested */}
          <div
            className="px-8 md:px-12"
            style={{ borderLeft: "1px solid var(--border)" }}
          >
            <div
              className="text-3xl"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                color: "var(--accent)",
              }}
            >
              <AnimatedNumber value={gapPercent} suffix="%" />
            </div>
            <div
              className="mt-2 text-[10px] tracking-[0.15em] uppercase"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                color: "var(--muted)",
              }}
            >
              Underinvested
            </div>
          </div>

          {/* Chains that break */}
          <div
            className="px-8 md:px-12"
            style={{ borderLeft: "1px solid var(--border)" }}
          >
            <div
              className="text-3xl"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                color: "var(--accent)",
              }}
            >
              <AnimatedNumber value={downstreamBreakPercent} suffix="%" />
            </div>
            <div
              className="mt-2 text-[10px] tracking-[0.15em] uppercase"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                color: "var(--muted)",
              }}
            >
              Break Downstream
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-start gap-2 cursor-pointer"
          onClick={() => {
            document
              .getElementById("featured-chain")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              color: "var(--muted)",
            }}
          >
            Explore
          </span>
          <motion.svg
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }}
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L8 8L15 1"
              stroke="var(--muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
