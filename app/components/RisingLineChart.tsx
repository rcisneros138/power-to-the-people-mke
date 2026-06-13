export default function RisingLineChart() {
  return (
    <div className="aspect-square bg-teal rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col relative overflow-hidden">
      <div className="flex items-baseline justify-between">
        <p className="font-bold uppercase tracking-wide text-navy/70 text-xs">
          Your We Energies bill
        </p>
        <p className="text-navy/50 text-xs uppercase tracking-wide font-bold">
          Year over year
        </p>
      </div>

      <div className="relative flex-1 mt-3 min-h-0">
        <svg
          viewBox="0 0 400 280"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Line graph with X and Y axes showing a curve that rises slowly then steeply — illustrating utility bills climbing 30–40% over time."
        >
          <defs>
            <marker
              id="rising-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF4715" />
            </marker>
          </defs>

          <g stroke="#133020" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="square">
            <line x1="36" y1="14" x2="36" y2="258" />
            <line x1="34" y1="256" x2="388" y2="256" />

            <line x1="30" y1="60" x2="36" y2="60" />
            <line x1="30" y1="120" x2="36" y2="120" />
            <line x1="30" y1="180" x2="36" y2="180" />

            <line x1="110" y1="256" x2="110" y2="262" />
            <line x1="190" y1="256" x2="190" y2="262" />
            <line x1="270" y1="256" x2="270" y2="262" />
            <line x1="350" y1="256" x2="350" y2="262" />
          </g>

          <text
            x="22"
            y="22"
            fontSize="14"
            fontWeight="700"
            fill="#133020"
            fillOpacity="0.55"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            $
          </text>
          <text
            x="388"
            y="276"
            fontSize="9"
            fontWeight="700"
            fill="#133020"
            fillOpacity="0.55"
            textAnchor="end"
            letterSpacing="0.08em"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            TIME →
          </text>

          <path
            className="rising-line"
            d="M 46 246 C 200 250, 280 220, 370 32"
            fill="none"
            stroke="#FF4715"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            markerEnd="url(#rising-arrow)"
          />
        </svg>
      </div>

      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t-2 border-navy/15 flex items-baseline gap-3 sm:gap-4 rising-label">
        <div className="font-talina text-navy text-3xl sm:text-4xl lg:text-[2.75rem] leading-none whitespace-nowrap">
          30-40%
        </div>
        <div className="text-[11px] sm:text-xs text-navy/80 uppercase tracking-wide font-bold leading-tight">
          higher than<br />Wisconsin&apos;s public utilities
        </div>
      </div>
    </div>
  );
}
