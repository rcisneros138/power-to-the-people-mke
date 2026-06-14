export default function HandshakeTile() {
  return (
    <div className="aspect-square bg-teal rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col relative overflow-hidden">
      <div className="flex items-baseline justify-between">
        <p className="font-bold uppercase tracking-wide text-navy/70 text-xs">
          Owned by all of us
        </p>
        <p className="text-navy/50 text-xs uppercase tracking-wide font-bold">
          Run for us
        </p>
      </div>

      <div className="relative flex-1 mt-3 min-h-0 flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #133020 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/handshake.svg"
          alt="Two hands shaking, representing shared public ownership."
          className="handshake-icon relative w-3/4 h-3/4 max-w-[300px] max-h-[300px] object-contain"
        />
      </div>

      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t-2 border-navy/15 flex items-baseline gap-3 sm:gap-4">
        <div className="font-talina text-navy text-3xl sm:text-4xl lg:text-[2.75rem] leading-none whitespace-nowrap">
          Ch. 197
        </div>
        <div className="text-[11px] sm:text-xs text-navy/80 uppercase tracking-wide font-bold leading-tight">
          Wisconsin&apos;s path<br />to public power
        </div>
      </div>
    </div>
  );
}
