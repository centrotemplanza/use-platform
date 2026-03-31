import Link from "next/link";

const features = [
  {
    title: "Guided learning",
    description:
      "Follow structured paths instead of consuming disconnected content.",
  },
  {
    title: "Real practice",
    description:
      "Apply what you learn through real progression and practical development.",
  },
  {
    title: "Clear progression",
    description:
      "Move through levels with a system designed to make growth visible.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24 py-8 md:py-12">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Unified Self Evolution
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 md:text-6xl md:leading-[1.05]">
            Structured self evolution for real learning and real progress.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            A platform designed to guide growth through structured learning,
            real practice, and clear progression across every stage.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="inline-flex rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Explore courses
            </Link>

            <Link
              href="/signup"
              className="inline-flex rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
          <p className="text-sm font-medium text-zinc-500">Platform model</p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-sm text-zinc-500">Level 01</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-950">Base</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Start with foundational access and structured orientation.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-sm text-zinc-500">Level 02</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-950">
                Practitioner
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Go deeper into practical learning and real implementation.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-sm text-zinc-500">Level 03</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-950">
                Instructor
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Unlock advanced access for accredited professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Core value
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
            A system designed to make growth clearer and more structured.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-zinc-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Start now
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
            Start your evolution today
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            Join the platform and begin a more structured path for learning,
            practice, and progression.
          </p>

          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}