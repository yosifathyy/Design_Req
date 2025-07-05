import { cn } from "@/lib/utils";

export function RetroGrid({
  className,
  angle = 65,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden opacity-50 [perspective:200px]",
        className,
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid",
            "will-change-transform",
            "[backface-visibility:hidden]",
            "[transform-style:preserve-3d]",
            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]",

            // Grey grid lines with improved anti-aliasing
            "[background-image:linear-gradient(to_right,rgba(166,166,166,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(166,166,166,0.8)_1px,transparent_1px)]",
          )}
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent to-90%" />
    </div>
  );
}
