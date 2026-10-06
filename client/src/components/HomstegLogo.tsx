type HomstegLogoProps = {
  className?: string;
  iconOnly?: boolean;
  size?: number;
};

export default function HomstegLogo({
  className = "",
  iconOnly = false,
  size = 44,
}: HomstegLogoProps) {
  return (
    <div
      className={`inline-flex items-center ${iconOnly ? "" : "gap-2"} ${className}`}
      aria-label="HOMSTEG"
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 453 468"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className="block shrink-0"
      >
        <use href="/homsteg-logo.svg#homsteg-h" />
      </svg>

      {!iconOnly && (
        <span
          aria-hidden="true"
          className="whitespace-nowrap font-bold tracking-[-0.04em] text-current"
          style={{
            fontSize: `${Math.max(size * 0.52, 16)}px`,
            lineHeight: 1,
          }}
        >
          HOMSTEG
        </span>
      )}
    </div>
  );
}
