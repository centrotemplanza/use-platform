import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-zinc-950">
              {siteConfig.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              A platform designed to guide users from foundational learning into
              deeper practice and progression.
            </p>
          </div>

          <div className="grid gap-3 md:justify-self-end">
            {siteConfig.footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-600 transition hover:text-zinc-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          © {new Date().getFullYear()} {siteConfig.name}
        </div>
      </div>
    </footer>
  );
}