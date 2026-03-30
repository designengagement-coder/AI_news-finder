"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SourceBadge } from "@/components/SourceBadge";

type DismissibleToolBannerProps = {
  item: {
    title: string;
    summary: string;
    fullUrl: string;
    sourceName: string;
    extractedTools: string[];
    tags: string[];
  } | null;
};

export function DismissibleToolBanner({ item }: DismissibleToolBannerProps) {
  const [hidden, setHidden] = useState(false);

  if (!item || hidden) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-black/8 bg-[#eff3ed] shadow-panel">
      <button
        type="button"
        onClick={() => setHidden(true)}
        className="absolute right-4 top-4 z-10 rounded-full border border-black/8 bg-white/90 p-2 text-slate"
        aria-label="Hide featured tool banner"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="grid aspect-video gap-6 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Featured tool signal</p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight text-ink md:text-4xl">
              {item.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate md:text-base">{item.summary}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[24px] bg-white/80 p-5 ring-1 ring-black/6">
          <div>
            <SourceBadge source={item.sourceName} label="tool watch" />
            <p className="mt-4 text-sm font-medium text-slate">Why it matters</p>
            <p className="mt-2 text-sm leading-7 text-slate">
              This tool is showing up in the current feed as part of how design and product teams are
              exploring AI-assisted delivery.
            </p>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate">Related tool mentions</p>
            <p className="mt-2 text-sm text-ink">
              {item.extractedTools.slice(0, 4).join(", ") || "Tool context is still emerging"}
            </p>
            <a
              href={item.fullUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
            >
              Open source detail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
