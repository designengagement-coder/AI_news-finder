import { ReactNode } from "react";

type SectionCarouselProps = {
  eyebrow: string;
  title: string;
  description: string;
  viewMoreHref: string;
  children: ReactNode;
};

export function SectionCarousel({
  eyebrow,
  title,
  description,
  viewMoreHref,
  children
}: SectionCarouselProps) {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">{description}</p>
        </div>
      </div>
      <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <div className="mt-4">
        <a
          href={viewMoreHref}
          className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink"
        >
          View more
        </a>
      </div>
    </section>
  );
}
