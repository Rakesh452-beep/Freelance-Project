import Reveal from "@/components/Reveal";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-end justify-between gap-10 border-b border-hairline pb-8">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-electric">
            <span className="text-gradient-blue">{"//"}</span>
            {index} — {eyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ice sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ice-soft">
              {description}
            </p>
          ) : null}
        </div>
        <div className="hidden shrink-0 flex-col items-end gap-3 sm:flex">
          <div className="h-1 w-24 rounded-full bg-blue-gradient" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-ice-faint">
            Dhanunjay.Three.Lenses
          </span>
        </div>
      </div>
    </Reveal>
  );
}
