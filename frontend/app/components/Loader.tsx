"use client";

const Loader = () => {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-5"
      data-testid="loader"
      aria-live="polite"
    >
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-ink-100" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin" />
        <div className="absolute inset-2 rounded-full bg-cream-200" />
      </div>
      <p className="text-sm text-ink-500 font-medium tracking-wide">
        Loading…
      </p>
    </div>
  );
};

export default Loader;
