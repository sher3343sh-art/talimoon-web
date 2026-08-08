import Link from "next/link";

export interface ComingSoonProps {
  title: string;
  message: string;
}

export function ComingSoon({ title, message }: ComingSoonProps) {
  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[var(--surface-base)] px-6 py-32 text-center">
      <p className="font-sans text-label uppercase tracking-[0.18em] text-text-secondary">
        Coming Soon
      </p>
      <h1 className="mt-4 font-serif text-display text-text-primary">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-[48ch] font-sans text-body text-text-secondary">
        {message}
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center justify-center rounded px-8 font-sans text-sm font-medium tracking-[0.02em] text-white bg-accent-primary hover:bg-accent-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
      >
        Back to Home
      </Link>
    </main>
  );
}
