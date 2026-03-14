"use client";

import { useMemo } from "react";
import type { TheoryOfChange } from "@/lib/types";

interface Props {
  tocs: TheoryOfChange[];
}

export default function HeroStats({ tocs }: Props) {
  const stats = useMemo(() => {
    const total = tocs.length;
    const domains = new Set(tocs.map((t) => t.domain)).size;
    const underinvested = tocs.filter(
      (t) => t.investmentLevel === "Minimal/None"
    ).length;
    const transformational = tocs.filter(
      (t) => t.impactScale === "Transformational"
    ).length;
    const pct = Math.round((underinvested / total) * 100);
    return { total, domains, pct, transformational };
  }, [tocs]);

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-wrap gap-10">
            <Stat value={stats.total} label="Theories of Change mapped" />
            <Stat value={stats.domains} label="Domains covered" />
            <Stat value={`${stats.pct}%`} label="With minimal or no investment" highlight />
            <Stat value={stats.transformational} label="Transformational-scale opportunities" />
          </div>
        </div>
        <p className="mt-6 text-gray-500 text-sm max-w-2xl">
          Mapping where AI investment would create the most good — and where it's missing.
        </p>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  highlight = false,
}: {
  value: string | number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div
        className={`text-4xl font-bold tabular-nums ${
          highlight ? "text-red-500" : "text-gray-900"
        }`}
      >
        {value}
      </div>
      <div className="text-sm text-gray-500 mt-1 max-w-[140px]">{label}</div>
    </div>
  );
}
