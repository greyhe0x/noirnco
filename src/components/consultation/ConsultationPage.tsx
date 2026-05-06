"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft, ArrowRight, MessageCircle, Sparkles,
  CheckCircle2, ChevronRight, CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
/* ─── Config ──────────────────────────────────────────────────────────────── */
const WA_NUMBER = "233000000000"; // ← replace with real number

/* ─── Types ───────────────────────────────────────────────────────────────── */
type StepId   = "name" | "intent" | "eventType" | "phone";
type Intent   = "exploring" | "deciding" | "planning";
interface FormData {
  name:      string;
  intent:    Intent | "";
  eventType: string;
  phone:     string;
}

/* ─── Data ────────────────────────────────────────────────────────────────── */
const INTENT_OPTIONS: { id: Intent; emoji: string; label: string; sub: string }[] = [
  { id: "exploring", emoji: "👀", label: "I'm exploring Ghana",          sub: "Curious about opportunities & what's possible"  },
  { id: "deciding",  emoji: "🤔", label: "I have a goal in mind",        sub: "Investment, market entry, or a diaspora visit"   },
  { id: "planning",  emoji: "🗓️", label: "I'm ready to plan a program",  sub: "I know what I need — let's get started"          },
];

const EVENT_TYPES = [
  "Investor Delegation",
  "Corporate Site Visit",
  "Market Entry Program",
  "Fellowship / Leadership Program",
  "Diaspora Experience",
  "Startup Ecosystem Event",
  "Private Concierge Visit",
  "Something else",
];

/* ─── Slideshow data ──────────────────────────────────────────────────────── */
const SLIDES = [
  {
    label: "Halcyon 2025 Fellowship",
    caption: "Leadership & market immersion — Accra, Ghana",
    gradient: "linear-gradient(160deg, #0E1118 0%, #1a2a3a 40%, #0f2035 100%)",
    blob: "radial-gradient(ellipse at 30% 60%, rgba(252,136,62,0.35) 0%, transparent 60%)",
    tag: "Fellowship",
    image: "/images/corporate.png",
  },
  {
    label: "Investor Forum Series",
    caption: "Curated deal-flow sessions — Kempinski, Accra",
    gradient: "linear-gradient(160deg, #0a0a14 0%, #1a1040 40%, #0d0a20 100%)",
    blob: "radial-gradient(ellipse at 70% 40%, rgba(155,62,110,0.4) 0%, transparent 60%)",
    tag: "Investor",
    image: "/images/talks.png",
  },
  {
    label: "Adonai Partners Market Entry",
    caption: "Bespoke delegation program — Accra & Kumasi",
    gradient: "linear-gradient(160deg, #0f0a08 0%, #2a1508 40%, #1a0e00 100%)",
    blob: "radial-gradient(ellipse at 50% 30%, rgba(252,136,62,0.45) 0%, transparent 55%)",
    tag: "Market Entry",
    image: "/images/selfie-smile.png",
  },
] as const;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const first = (name: string) => name.trim().split(/\s+/)[0] || name.trim();

function getSteps(intent: Intent | ""): StepId[] {
  return ["name", "intent", ...(intent === "planning" ? (["eventType"] as StepId[]) : []), "phone"];
}

function buildWAMessage(d: FormData) {
  const fn = first(d.name);
  if (d.intent === "exploring")
    return `Hello Noir & Co! 👋\n\nMy name is ${fn} and I'm exploring Ghana — curious about the opportunities and experiences you can help design.\n\nWould love to learn more!\n\n📱 *My number:* ${d.phone}`;
  if (d.intent === "deciding")
    return `Hello Noir & Co! 🤔\n\nI'm ${fn}. I have a goal in mind — investment, market entry, or a diaspora visit — but I'm still figuring out the right approach.\n\nCould we have a quick discovery call?\n\n📱 *My number:* ${d.phone}`;
  return `Hello Noir & Co! 🗓️\n\nI'm ${fn} and I'm ready to plan a *${d.eventType}* in Ghana. I'd love to get started!\n\n📱 *My number:* ${d.phone}`;
}

/* ─── Slide-in question text per step ─────────────────────────────────────── */
function getQuestion(step: StepId, d: FormData): { q: string; hint: string } {
  const fn = first(d.name);
  switch (step) {
    case "name":
      return {
        q:    "What's your name?",
        hint: "We'll use this to personalise your experience.",
      };
    case "intent":
      return {
        q:    `Nice to meet you, ${fn}! What brings you here?`,
        hint: "Pick the option that best describes where you are right now.",
      };
    case "eventType":
      return {
        q:    "What kind of program are you planning?",
        hint: "Select the closest match — we design all of these.",
      };
    case "phone":
      if (d.intent === "exploring")
        return {
          q:    `Last step, ${fn}. How can we reach you?`,
          hint: "We'll share what's possible and what others have done.",
        };
      if (d.intent === "deciding")
        return {
          q:    `Almost there, ${fn}. Where can we reach you?`,
          hint: "We'll book a free 15-minute discovery call.",
        };
      return {
        q:    `Almost there, ${fn}. What's the best number?`,
        hint: `We'll be in touch to start designing your ${d.eventType}.`,
      };
  }
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* EventSlideshow                                                             */
/* ══════════════════════════════════════════════════════════════════════════ */
function EventSlideshow() {
  /*
   * Keep active in BOTH a ref and state:
   *   - ref  → always current inside callbacks (no stale-closure glitch)
   *   - state → triggers re-render for the caption text
   */
  const [active, setActive] = useState(0);
  const activeRef           = useRef(0);
  const slideRefs           = useRef<(HTMLDivElement | null)[]>([]);
  const captionRef          = useRef<HTMLDivElement>(null);
  const isAnimating         = useRef(false);
  const intervalRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  /* goTo has NO dependency on active state — uses activeRef instead */
  const goTo = useCallback((next: number) => {
    if (isAnimating.current || next === activeRef.current) return;
    isAnimating.current = true;
    const prev     = activeRef.current;
    const current  = slideRefs.current[prev];
    const incoming = slideRefs.current[next];
    if (!current || !incoming) { isAnimating.current = false; return; }

    gsap.set(incoming, { opacity: 0, zIndex: 2, scale: 1.06 });
    gsap.set(current,  { zIndex: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(current, { zIndex: 0, opacity: 1, scale: 1 });
        isAnimating.current = false;
        activeRef.current   = next;
        setActive(next);
      },
    });

    if (captionRef.current)
      tl.to(captionRef.current, { opacity: 0, y: -8, duration: 0.22, ease: "power2.in" }, 0);
    tl.to(incoming, { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" }, 0.1);
    tl.to(current,  { opacity: 0,           duration: 0.55, ease: "power2.in"  }, 0.1);
    if (captionRef.current)
      tl.to(captionRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.55);
  }, []); // stable — no deps needed

  /* Start auto-advance on mount; clean up on unmount */
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0, scale: 1 });
    });

    intervalRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % SLIDES.length;
      goTo(next);
    }, 4500);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [goTo]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el; }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.label}
            fill
            priority={i === 0}
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#050812]/20" />
        </div>
      ))}

      {/* Bottom gradient for text legibility */}
      <div
        className="absolute bottom-0 inset-x-0 h-64 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(5,8,18,0.88) 0%, rgba(5,8,18,0.4) 55%, transparent 100%)" }}
      />

      {/* Caption — bottom-aligned to match the WA shortcut on the left */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-10 pb-7">
        {/* Slide dots */}
        <div className="flex items-center gap-1.5 mb-5">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-400"
              style={{
                width:      i === active ? "22px" : "6px",
                height:     "6px",
                background: i === active ? "#FC883E" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
        <div ref={captionRef}>
          <h3
            className="font-heading font-bold text-white mb-1"
            style={{ fontSize: "1.3rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}
          >
            {SLIDES[active].label}
          </h3>
          <p className="font-body text-white/50" style={{ fontSize: "0.78rem" }}>
            {SLIDES[active].caption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* ConsultationPage                                                           */
/* ══════════════════════════════════════════════════════════════════════════ */
export function ConsultationPage() {
  const pageRef  = useRef<HTMLDivElement>(null);
  const stepRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [step,      setStep]      = useState<StepId>("name");
  const [animDir,   setAnimDir]   = useState<1 | -1>(1);   // 1=forward, -1=back
  const [formData,  setFormData]  = useState<FormData>({ name: "", intent: "", eventType: "", phone: "" });
  const [inputVal,  setInputVal]  = useState("");
  const [inputErr,  setInputErr]  = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ── Entrance animation ─────────────────────────────────────────────── */
  useGSAP(() => {
    gsap.fromTo(".consult-left",  { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
    gsap.fromTo(".consult-right", { opacity: 0, x:  40 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.2 });
  }, { scope: pageRef });

  /* ── Animate step in whenever `step` changes (skip initial mount) ───── */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const fromY = animDir * 32;
    gsap.fromTo(stepRef.current,
      { y: fromY, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.38, ease: "power3.out" }
    );
    // Focus text inputs after transition
    if (step === "name" || step === "phone") {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [step, animDir]);

  /* ── Derive step list + progress ────────────────────────────────────── */
  const steps    = getSteps(formData.intent);
  const stepIdx  = steps.indexOf(step);
  const progress = (stepIdx + 1) / steps.length;
  const isLast   = stepIdx === steps.length - 1;

  /* ── Current input value per text step ──────────────────────────────── */
  useEffect(() => {
    setInputVal(step === "name" ? formData.name : step === "phone" ? formData.phone : "");
    setInputErr("");
  }, [step, formData.name, formData.phone]);

  /* ── Navigate forward ───────────────────────────────────────────────── */
  const advance = useCallback((patch: Partial<FormData> = {}) => {
    const newData = { ...formData, ...patch };

    // Validate text inputs
    if (step === "name"  && !newData.name.trim())  { setInputErr("Please tell us your name."); return; }
    if (step === "phone" && !newData.phone.trim()) { setInputErr("Please enter your WhatsApp number."); return; }

    const nextSteps = getSteps(newData.intent);
    const nextIdx   = nextSteps.indexOf(step) + 1;
    const next      = nextSteps[nextIdx];

    gsap.to(stepRef.current, {
      y: -32, opacity: 0, duration: 0.22, ease: "power2.in",
      onComplete: () => {
        setFormData(newData);
        setAnimDir(1);
        if (!next) {
          setSubmitted(true);
          setTimeout(() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWAMessage(newData))}`, "_blank"), 500);
        } else {
          setStep(next);
        }
      },
    });
  }, [formData, step]);

  /* ── Navigate backward ──────────────────────────────────────────────── */
  const goBack = useCallback(() => {
    if (stepIdx === 0) return;
    gsap.to(stepRef.current, {
      y: 32, opacity: 0, duration: 0.22, ease: "power2.in",
      onComplete: () => {
        setAnimDir(-1);
        setStep(steps[stepIdx - 1]);
      },
    });
  }, [stepIdx, steps]);

  /* ── Keyboard: Enter to advance on text steps ───────────────────────── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const key = step === "name" ? "name" : "phone";
      advance({ [key]: inputVal });
    }
  };

  /* ── Success screen ─────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center gap-6 max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-[#25D366]" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-secondary mb-2" style={{ fontSize: "1.75rem" }}>
              Opening WhatsApp…
            </h2>
            <p className="font-body text-gray-500" style={{ lineHeight: 1.75 }}>
              Your details are pre-filled. Just hit <strong>Send</strong> and we&apos;ll
              be in touch very soon, {first(formData.name)}.
            </p>
          </div>
          <Link href="/"
                className="inline-flex items-center gap-2 font-body font-medium text-primary hover:text-primary-dark transition-colors"
                style={{ fontSize: "0.9rem" }}>
            <ArrowLeft size={16} /> Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  /* ── Question + hint for this step ──────────────────────────────────── */
  const { q, hint } = getQuestion(step, formData);

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div ref={pageRef} className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[55fr_45fr]">

      {/* ════ LEFT — form ════════════════════════════════════════════════ */}
      <div className="consult-left flex flex-col bg-background h-full overflow-hidden" style={{ opacity: 0 }}>

        {/* ── Progress bar ──────────────────────────────────────────── */}
        <div className="h-1 w-full bg-gray-100 flex-shrink-0">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* ── Top bar ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 md:px-10 xl:px-14 py-4 flex-shrink-0">
          <button
            onClick={goBack}
            className={cn(
              "inline-flex items-center gap-1.5 font-body font-medium transition-colors",
              "text-gray-400 hover:text-secondary",
              stepIdx === 0 && "opacity-0 pointer-events-none"
            )}
            style={{ fontSize: "0.85rem" }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <span className="font-heading font-bold text-secondary" style={{ fontSize: "0.95rem" }}>
            {BRAND.name}
          </span>
          <Link href="/"
                className="font-body text-gray-400 hover:text-secondary transition-colors"
                style={{ fontSize: "0.78rem" }}>
            Exit
          </Link>
        </div>

        {/* ── Step content ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 xl:px-14 pb-6 overflow-hidden">

          {/* Step container — animated on transition */}
          <div ref={stepRef} className="w-full">

            {/* Step number */}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="font-heading font-bold text-primary" style={{ fontSize: "0.78rem" }}>
                {String(stepIdx + 1).padStart(2, "0")}
              </span>
              <ArrowRight size={11} className="text-primary" />
            </div>

            {/* Question */}
            <h2
              className="font-heading font-bold text-secondary mb-2"
              style={{ fontSize: "clamp(1.4rem, 2.8vw, 2rem)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
            >
              {q}
            </h2>
            <p className="font-body text-gray-400 mb-7" style={{ fontSize: "0.875rem" }}>
              {hint}
            </p>

            {/* ── NAME step ─────────────────────────────────────────── */}
            {step === "name" && (
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    autoComplete="given-name"
                    placeholder="Your name"
                    value={inputVal}
                    onChange={(e) => { setInputVal(e.target.value); setInputErr(""); }}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "w-full bg-transparent pb-3 pt-1 font-body text-secondary placeholder:text-gray-300 outline-none",
                      "border-0 border-b-2 transition-colors duration-200",
                      inputErr ? "border-red-400" : "border-gray-200 focus:border-primary"
                    )}
                    style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
                  />
                  {inputErr && (
                    <p className="mt-2 font-body text-red-400" style={{ fontSize: "0.78rem" }}>{inputErr}</p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-body text-gray-300" style={{ fontSize: "0.75rem" }}>
                    <CornerDownLeft size={11} /> press Enter
                  </span>
                  <button
                    onClick={() => advance({ name: inputVal })}
                    className="inline-flex items-center gap-2 bg-primary text-white font-heading font-semibold rounded-full px-5 py-2.5 hover:bg-primary-dark transition-all duration-200 shadow-[var(--shadow-primary)]"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── INTENT step ───────────────────────────────────────── */}
            {step === "intent" && (
              <div className="flex flex-col gap-2.5">
                {INTENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => advance({ intent: opt.id })}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 rounded-2xl border text-left",
                      "transition-all duration-150 group cursor-pointer",
                      "border-gray-200 hover:border-primary/60 hover:bg-primary/[0.04]"
                    )}
                  >
                    <span className="text-2xl flex-shrink-0 leading-none">{opt.emoji}</span>
                    <div>
                      <p className="font-heading font-semibold text-secondary group-hover:text-primary transition-colors duration-150"
                         style={{ fontSize: "0.9375rem" }}>
                        {opt.label}
                      </p>
                      <p className="font-body text-gray-400 mt-0.5" style={{ fontSize: "0.78rem" }}>
                        {opt.sub}
                      </p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-primary transition-colors duration-150 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* ── EVENT TYPE step ───────────────────────────────────── */}
            {step === "eventType" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => advance({ eventType: type })}
                    className={cn(
                      "px-4 py-3.5 rounded-xl border text-left font-body font-medium",
                      "transition-all duration-150 cursor-pointer",
                      "border-gray-200 text-secondary hover:border-primary hover:bg-primary/[0.04] hover:text-primary"
                    )}
                    style={{ fontSize: "0.875rem" }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {/* ── PHONE step ────────────────────────────────────────── */}
            {step === "phone" && (
              <div className="flex flex-col gap-5">
                <div>
                  <input
                    ref={inputRef}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={inputVal}
                    onChange={(e) => { setInputVal(e.target.value); setInputErr(""); }}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "w-full bg-transparent pb-3 pt-1 font-body text-secondary placeholder:text-gray-300 outline-none",
                      "border-0 border-b-2 transition-colors duration-200",
                      inputErr ? "border-red-400" : "border-gray-200 focus:border-primary"
                    )}
                    style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
                  />
                  {inputErr && (
                    <p className="mt-2 font-body text-red-400" style={{ fontSize: "0.78rem" }}>{inputErr}</p>
                  )}
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 font-body text-gray-300" style={{ fontSize: "0.75rem" }}>
                    <CornerDownLeft size={11} /> press Enter
                  </span>
                  <button
                    onClick={() => advance({ phone: inputVal })}
                    className="inline-flex items-center gap-2 bg-primary text-white font-heading font-semibold rounded-full px-5 py-2.5 hover:bg-primary-dark transition-all duration-200 shadow-[var(--shadow-primary)]"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Send to WhatsApp <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

          </div>{/* end stepRef */}
        </div>

        {/* ── Footer: direct chat shortcut ─────────────────────────── */}
        <div className="px-6 md:px-10 xl:px-14 pb-7 flex-shrink-0 border-t border-gray-100 pt-4">
          <p className="font-body text-gray-400 mb-3" style={{ fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Or reach us directly
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Noir & Co! 👋 I'd like to book a consultation. Can we chat?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-gray-200 group hover:border-[#25D366]/40 hover:bg-[#25D366]/[0.04] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <MessageCircle size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-secondary group-hover:text-[#128C7E] transition-colors" style={{ fontSize: "0.8rem" }}>
                Prefer to chat directly?
              </p>
              <p className="font-body text-gray-400" style={{ fontSize: "0.72rem" }}>
                Message us on WhatsApp — we respond within 24 hrs
              </p>
            </div>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-[#25D366] transition-colors flex-shrink-0" />
          </a>
        </div>

      </div>{/* end left panel */}

      {/* ════ RIGHT — slideshow ══════════════════════════════════════════ */}
      <div className="consult-right hidden lg:block relative overflow-hidden" style={{ opacity: 0 }}>
        <EventSlideshow />
      </div>

    </div>
  );
}
