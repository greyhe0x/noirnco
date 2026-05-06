"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { NAV_LINKS, BRAND } from "@/lib/constants";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface/90 backdrop-blur-md shadow-[var(--shadow-card)] py-3"
          : "bg-background/80 backdrop-blur-sm py-5"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt={BRAND.name}
            width={140}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-body-sm font-medium font-body transition-colors duration-200",
                scrolled
                  ? "text-gray-600 hover:text-primary"
                  : "text-gray-600 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Button size="sm" variant="primary" asChild>
            <Link href="/consultation">Book a Consultation</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors text-secondary hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-surface/95 backdrop-blur-md px-6 pt-4 pb-6 space-y-1 border-t border-gray-100">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-body font-medium font-body text-gray-700 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Button className="w-full" size="md" asChild>
              <Link href="/consultation">Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
