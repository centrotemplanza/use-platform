import Link from "next/link";

const evolutionLevels = [
  {
    title: "Base",
    description:
      "Start with foundational learning, orientation, and access to the platform.",
  },
  {
    title: "Practitioner",
    description:
      "Move deeper into practice through structured courses and completed milestones.",
  },
  {
    title: "Instructor",
    description:
      "Access advanced educational paths reserved for accredited therapists.",
  },
];

const currentCapabilities = [
  {
    title: "Authentication",
    description: "Users can sign in and access their learning environment.",
  },
  {
    title: "Courses and enrollments",
    description:
      "Course listing, course detail, and enrollment logic are already working.",
  },
  {
    title: "Certificates",
    description:
      "Users can generate and access certificates for completed learning milestones.",
  },
];

const accessRules = [
  {
    title: "Practitioner courses",
    description: "Open to everyone.",
  },
  {
    title: "Instructor courses",
    description: "Available only when therapist_accredited = true.",
  },
  {
    title: "UI behavior",
    description:
      "Each course page reflects whether the user can enroll, is already enrolled, or is locked.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Unified Self Evolution
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
              A structured platform for growth, learning, and progression.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              USE is designed to guide people through clear levels of evolution,
              from foundational access to deeper practitioner learning and
              advanced instructor pathways.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Explore courses
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
              >
                How it works
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
            <p className="text-sm font-medium text-zinc-500">Current product state</p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <p className="text-sm font-medium text-zinc-500">Profiles</p>
                <p className="mt-2 text-lg font-semibold text-zinc-950">
                  base → practitioner → instructor
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <p className="text-sm font-medium text-zinc-500">Access control</p>
                <p className="mt-2 text-lg font-semibold text-zinc-950">
                  Instructor content gated by therapist accreditation
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <p className="text-sm font-medium text-zinc-500">User experience</p>
                <p className="mt-2 text-lg font-semibold text-zinc-950">
                  Courses, enrollments, certificates, and personal pages already working
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Progression model
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Three levels, one coherent path
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
              The product should feel clear from the beginning. Users need to
              understand where they are, what they can access now, and what
              unlocks next.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {evolutionLevels.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6"
              >
                <h3 className="text-xl font-semibold text-zinc-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              What already works
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              A solid product foundation is already in place
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
              This public website should reinforce the system you have already
              built instead of inventing a separate story.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {currentCapabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-zinc-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Access logic
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Simple rules that scale
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
              Your current rules are easy to understand and strong enough to
              support future product growth.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {accessRules.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-zinc-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
              Next step
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Keep the public website clear. Keep the product experience focused.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-300 md:text-lg">
              USE already has working product logic. The site now needs a clean
              structure that explains the model and directs users into action.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                About USE
              </Link>

              <Link
                href="/courses"
                className="inline-flex rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-900"
              >
                Browse courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}