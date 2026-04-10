import { ReactNode } from "react";

type SectionCarouselProps = {
  eyebrow: string;
  title: string;
  description?: string;
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
    <section className="mt-14 pt-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">{eyebrow}</p>
          <h2 className="mt-2 text-[1.5rem] font-semibold leading-tight text-ink">{title}</h2>
          {description ? <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate">{description}</p> : null}
        </div>
      </div>
      <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <div className="mt-4">
        <a
          href={viewMoreHref}
          className="inline-flex h-10 items-center rounded-md border border-accent px-5 text-sm font-medium text-accent transition hover:border-accent-hover hover:text-accent-hover"
        >
          View more
        </a>
      </div>
    </section>
  );
}
