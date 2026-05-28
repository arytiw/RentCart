/**
 * Tiny className combiner — keeps Tailwind classes tidy without pulling
 * a runtime dependency (clsx). Filters falsy values.
 */
export function cn(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(" ");
}
