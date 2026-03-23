"use client";

import { motion } from "framer-motion";

interface HeroStat {
  value: string;
  label: string;
}

interface Props {
  stats: HeroStat[];
}

export default function CAHeroSection({ stats }: Props) {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center"
      style={{ background: "var(--background)" }}
    >
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden />

      <div className="max-w-[1400px] mx-auto px-6 py-24 flex flex-col gap-16">
        {/* State badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-widest border"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            California · Policymaker Presentation
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-normal leading-tight"
            style={{
              fontFamily: "var(--font-display, serif)",
              color: "var(--foreground)",
            }}
          >
            $300 billion flows into AI every year.
          </h1>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-normal leading-tight mt-2"
            style={{
              fontFamily: "var(--font-display, serif)",
              color: "var(--accent)",
            }}
          >
            Is it making California better or worse?
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-2xl text-lg md:text-xl leading-relaxed"
          style={{ color: "var(--muted)", fontFamily: "var(--font-display, serif)" }}
        >
          We don&apos;t know. And that&apos;s the problem.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)", background: "var(--border)" }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="px-6 py-5 flex flex-col gap-1"
              style={{ background: "var(--surface)" }}
            >
              <span
                className="text-3xl md:text-4xl font-normal"
                style={{
                  fontFamily: "var(--font-display, serif)",
                  color: i === 3 ? "var(--accent)" : "var(--foreground)",
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[11px] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ color: "var(--muted)" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
