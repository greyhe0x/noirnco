"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, BRAND } from "@/lib/constants";

export function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onDark = !scrolled; // true when floating over the dark hero

  return (
    /* Outer wrapper gives the "floating" offset from the top */
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">

      {/* ── Pill container ────────────────────────────────────────────────── */}
      <div
        className={cn(
          "max-w-7xl mx-auto rounded-2xl transition-all duration-500 ease-out",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-gray-100/80"
            : "bg-[#0E1118]/75 backdrop-blur-md border border-white/[0.08]"
        )}
      >
        {/* ── Top bar ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 md:px-6 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <Image
              src="/logo.png"
              alt={BRAND.name}
              width={880}
              height={1100}
              className={cn(
                "h-9 w-auto transition-all duration-500",
                // onDark ? 
                // "h-9 w-auto brightness-0 invert opacity-90 group-hover:opacity-100" // : "h-9 w-auto"
              )}
              priority
            />
          </Link>

          {/* Desktop nav  centred pill links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-xl font-body font-medium text-[0.8125rem] transition-all duration-200",
                  onDark
                    ? "text-white/65 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-secondary hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA + mobile toggle */}
          <div className="flex items-center gap-2.5">

            {/* Desktop CTA */}
            <Link
              href="/consultation"
              className={cn(
                "hidden md:inline-flex items-center gap-1.5 font-heading font-semibold rounded-xl px-4 py-2.5 text-[0.8125rem] transition-all duration-300 group",
                onDark
                  ? "bg-primary text-white hover:bg-primary-dark shadow-[0_4px_20px_rgba(252,136,62,0.40)]"
                  : "bg-secondary text-white hover:bg-secondary-light"
              )}
            >
              Book a Consultation
              <ArrowUpRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className={cn(
                "md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                onDark
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-secondary hover:bg-gray-100"
              )}
            >
              <span
                className={cn(
                  "transition-all duration-300",
                  open ? "rotate-90 opacity-100" : "rotate-0"
                )}
              >
                {open ? <X size={19} /> : <Menu size={19} />}
              </span>
            </button>
          </div>
        </div>

        {/* ── Mobile menu  expands inside the pill ─────────────────────── */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            open ? "max-h-[480px]" : "max-h-0"
          )}
        >
          <div
            className={cn(
              "px-4 pt-2 pb-4 flex flex-col gap-1",
              onDark ? "border-t border-white/10" : "border-t border-gray-100"
            )}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl font-body font-medium text-sm transition-all duration-150",
                  onDark
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-secondary hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="mt-2 px-1">
              <Link
                href="/consultation"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 font-heading font-semibold rounded-xl px-5 py-3.5 text-sm bg-primary text-white hover:bg-primary-dark transition-colors shadow-[var(--shadow-primary)]"
              >
                Book a Consultation
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
