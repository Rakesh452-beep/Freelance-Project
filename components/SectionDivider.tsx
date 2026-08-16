export type DividerVariant = "lens" | "film" | "pixel";

export default function SectionDivider({
  variant = "lens",
}: {
  variant?: DividerVariant;
}) {
  if (variant === "film") {
    return (
      <div aria-hidden="true" className="section-divider section-divider--film">
        <span className="sd-endmark sd-endmark--left" />
        <span className="sd-arm sd-arm--left" />
        <span className="sd-frame">
          <span className="sd-frame__notch sd-frame__notch--tl" />
          <span className="sd-frame__notch sd-frame__notch--tr" />
          <span className="sd-frame__notch sd-frame__notch--bl" />
          <span className="sd-frame__notch sd-frame__notch--br" />
          <span className="sd-frame__screen">
            <span className="sd-frame__play" />
            <span className="sd-frame__scan" />
          </span>
          <span className="sd-frame__rec" />
        </span>
        <span className="sd-arm sd-arm--right" />
        <span className="sd-endmark sd-endmark--right" />
        <span className="sd-shimmer" />
      </div>
    );
  }

  if (variant === "pixel") {
    return (
      <div aria-hidden="true" className="section-divider section-divider--pixel">
        <span className="sd-endmark sd-endmark--left" />
        <span className="sd-arm sd-arm--left" />
        <span className="sd-pixel">
          <span className="sd-pixel__row">
            <span className="sd-pixel__dot" />
            <span className="sd-pixel__dot" />
            <span className="sd-pixel__dot" />
          </span>
          <span className="sd-pixel__row">
            <span className="sd-pixel__dot" />
            <span className="sd-pixel__dot sd-pixel__dot--hot" />
            <span className="sd-pixel__dot" />
          </span>
          <span className="sd-pixel__row">
            <span className="sd-pixel__dot" />
            <span className="sd-pixel__dot" />
            <span className="sd-pixel__dot" />
          </span>
        </span>
        <span className="sd-arm sd-arm--right" />
        <span className="sd-endmark sd-endmark--right" />
        <span className="sd-shimmer" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="section-divider section-divider--lens">
      <span className="sd-endmark sd-endmark--left" />
      <span className="sd-arm sd-arm--left" />
      <span className="sd-lens sd-lens--side">
        <span className="sd-lens__glass" />
        <span className="sd-lens__core" />
      </span>
      <span className="sd-lens sd-lens--center">
        <span className="sd-lens__aperture" />
        <span className="sd-lens__ring" />
        <span className="sd-lens__glass" />
        <span className="sd-lens__core" />
      </span>
      <span className="sd-lens sd-lens--side">
        <span className="sd-lens__glass" />
        <span className="sd-lens__core" />
      </span>
      <span className="sd-arm sd-arm--right" />
      <span className="sd-endmark sd-endmark--right" />
      <span className="sd-shimmer" />
    </div>
  );
}
