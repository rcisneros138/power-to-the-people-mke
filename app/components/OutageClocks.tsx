const SIZE = 140;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
const MAX = 150;

type DialProps = {
  minutes: number;
  label: string;
  delay: number;
};

function ClockDial({ minutes, label, delay }: DialProps) {
  const pct = Math.min(minutes / MAX, 1);
  const offset = C * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="relative">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block"
          role="img"
          aria-label={`${label} utility: ${minutes} minutes of downtime per year.`}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = ((i * 30 - 90) * Math.PI) / 180;
            const innerR = R - STROKE / 2 - 6;
            const outerR = R - STROKE / 2 - 1;
            const x1 = SIZE / 2 + innerR * Math.cos(angle);
            const y1 = SIZE / 2 + innerR * Math.sin(angle);
            const x2 = SIZE / 2 + outerR * Math.cos(angle);
            const y2 = SIZE / 2 + outerR * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#133020"
                strokeOpacity={i % 3 === 0 ? 0.45 : 0.25}
                strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                strokeLinecap="round"
              />
            );
          })}

          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#133020"
            strokeOpacity="0.15"
            strokeWidth={STROKE}
          />

          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#FF4715"
            strokeWidth={STROKE}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            className="clock-arc"
            style={
              {
                strokeDasharray: C,
                "--clock-target-offset": offset,
                "--clock-initial-offset": C,
                "--clock-delay": `${delay}ms`,
              } as React.CSSProperties
            }
          />

        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-talina text-navy text-3xl sm:text-4xl leading-none mt-2">
            {minutes}
          </div>
          <div className="text-[9px] text-navy/70 uppercase tracking-wide font-bold mt-1">
            min/yr
          </div>
        </div>
      </div>
      <p className="font-bold uppercase tracking-wide text-navy text-xs">
        {label}
      </p>
    </div>
  );
}

export default function OutageClocks() {
  return (
    <div className="aspect-square bg-teal rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col relative overflow-hidden">
      <div className="flex items-baseline justify-between">
        <p className="font-bold uppercase tracking-wide text-navy/70 text-xs">
          Annual outage time
        </p>
        <p className="text-navy/50 text-xs uppercase tracking-wide font-bold">
          Per customer
        </p>
      </div>

      <div className="relative flex-1 mt-3 min-h-0 flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        <ClockDial minutes={59} label="Public" delay={250} />
        <div className="font-bold uppercase text-navy/40 text-lg sm:text-xl tracking-widest self-center mt-[-1.5rem]">
          vs
        </div>
        <ClockDial minutes={133} label="Private" delay={700} />
      </div>

      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t-2 border-navy/15 flex items-baseline gap-3 sm:gap-4">
        <div className="font-talina text-navy text-3xl sm:text-4xl lg:text-[2.75rem] leading-none whitespace-nowrap">
          2×
        </div>
        <div className="text-[11px] sm:text-xs text-navy/80 uppercase tracking-wide font-bold leading-tight">
          more downtime<br />on private utilities
        </div>
      </div>
    </div>
  );
}
