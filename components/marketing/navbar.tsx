"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function MarketingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-zinc-900">
            {siteConfig.name}
          </span>
          <span className="text-xs text-zinc-500">{siteConfig.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-600 transition hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/courses"
            className="text-sm text-zinc-600 transition hover:text-black"
          >
            Explore
          </Link>

          <Link
            href="/login"
            className="text-sm text-zinc-600 transition hover:text-black"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 md:hidden"
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {isOpen ? (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
            {siteConfig.marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-700"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/courses"
              className="text-sm text-zinc-700"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>

            <Link
              href="/login"
              className="text-sm text-zinc-700"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="inline-flex w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
              onClick={() => setIsOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}