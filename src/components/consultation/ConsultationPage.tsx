"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft, ArrowRight, MessageCircle, Sparkles,
  CheckCircle2, ChevronRight, CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import { EventSlideshow } from "@/components/consultation/EventSlideshow";
import { EVENT_TYPES, INTENT_OPTIONS } from "@/components/consultation/consultationData";
import {
  COUNTRY_CALLING_CODES,
  formatCountryCallingCodeCompactLabel,
  formatCountryCallingCodeLabel,
} from "@/lib/phone/countryCallingCodes";
/* ─── Config ──────────────────────────────────────────────────────────────── */
const WA_NUMBER = "+233551204941"; // +233 55 120 4941

/* ─── Types ───────────────────────────────────────────────────────────────── */
type StepId = "name" | "intent" | "eventType" | "contact";
type Intent   = "exploring" | "deciding" | "planning";
type ContactMethod = "whatsapp" | "email";
interface FormData {
  name:      string;
  intent:    Intent | "";
  eventType: string;
  contactMethod: ContactMethod;
  phoneCallingCode: string; // e.g. "+233"
  phoneNational: string; // e.g. "551204941"
  email: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const first = (name: string) => name.trim().split(/\s+/)[0] || name.trim();

function getSteps(intent: Intent | ""): StepId[] {
  return ["name", "intent", ...(intent === "planning" ? (["eventType"] as StepId[]) : []), "contact"];
}

function buildContactLine(d: FormData) {
  if (d.contactMethod === "email") return `📧 *Email:* ${d.email}`;
  const phone = `${d.phoneCallingCode}${d.phoneNational}`;
  return `📱 *WhatsApp:* ${phone}`;
}

function buildWAMessage(d: FormData) {
  const fn = first(d.name);
  if (d.intent === "exploring")
    return `Hello Noir & Co! 👋\n\nMy name is ${fn} and I'm exploring Ghana  curious about the opportunities and experiences you can help design.\n\nWould love to learn more!\n\n${buildContactLine(d)}`;
  if (d.intent === "deciding")
    return `Hello Noir & Co! 🤔\n\nI'm ${fn}. I have a goal in mind  investment, market entry, or a diaspora visit  but I'm still figuring out the right approach.\n\nCould we have a quick discovery call?\n\n${buildContactLine(d)}`;
  return `Hello Noir & Co! 🗓️\n\nI'm ${fn} and I'm ready to plan a *${d.eventType}* in Ghana. I'd love to get started!\n\n${buildContactLine(d)}`;
}

function buildEmailSubject(d: FormData) {
  const fn = first(d.name);
  if (d.intent === "exploring") return `Consultation  Exploring Ghana (${fn})`;
  if (d.intent === "deciding") return `Consultation  Discovery call (${fn})`;
  return `Consultation  Planning: ${d.eventType} (${fn})`;
}

function buildEmailBody(d: FormData) {
  return buildWAMessage(d);
}

function buildMailtoHref(d: FormData) {
  const subject = encodeURIComponent(buildEmailSubject(d));
  const body = encodeURIComponent(buildEmailBody(d));
  return `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
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
        hint: "Select the closest match  we design all of these.",
      };
    case "contact":
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
        q:    `Almost there, ${fn}. How can we reach you?`,
        hint: `We'll be in touch to start designing your ${d.eventType}.`,
      };
  }
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
  const [formData,  setFormData]  = useState<FormData>({
    name: "",
    intent: "",
    eventType: "",
    contactMethod: "whatsapp",
    phoneCallingCode: "+233",
    phoneNational: "",
    email: "",
  });
  const [inputVal,  setInputVal]  = useState("");
  const [inputErr,  setInputErr]  = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [contactMethod, setContactMethod] = useState<ContactMethod>("whatsapp");
  const [phoneCallingCode, setPhoneCallingCode] = useState("+233");
  const [phoneNational, setPhoneNational] = useState("");
  const [email, setEmail] = useState("");
  const [useCustomCallingCode, setUseCustomCallingCode] = useState(false);

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
    if (step === "name" || step === "contact") {
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
    if (step === "name") {
      setInputVal(formData.name);
      setInputErr("");
      return;
    }
    if (step === "contact") {
      setContactMethod(formData.contactMethod);
      setPhoneCallingCode(formData.phoneCallingCode);
      setPhoneNational(formData.phoneNational);
      setEmail(formData.email);
      setUseCustomCallingCode(false);
      setInputErr("");
      return;
    }
    setInputVal("");
    setInputErr("");
  }, [step, formData.name, formData.contactMethod, formData.phoneCallingCode, formData.phoneNational, formData.email]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  /* ── Navigate forward ───────────────────────────────────────────────── */
  const advance = useCallback((patch: Partial<FormData> = {}) => {
    const newData = { ...formData, ...patch };

    // Validate text inputs
    if (step === "name"  && !newData.name.trim())  { setInputErr("Please tell us your name."); return; }
    if (step === "contact") {
      if (newData.contactMethod === "email") {
        if (!newData.email.trim()) { setInputErr("Please enter your email address."); return; }
        if (!isValidEmail(newData.email)) { setInputErr("Please enter a valid email address."); return; }
      } else {
        if (!newData.phoneNational.trim()) { setInputErr("Please enter your WhatsApp number."); return; }
        if (!newData.phoneCallingCode.trim()) { setInputErr("Please select your country code."); return; }
      }
    }

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
          setTimeout(() => {
            if (newData.contactMethod === "email") {
              window.open(buildMailtoHref(newData), "_blank");
              return;
            }
            window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWAMessage(newData))}`, "_blank");
          }, 500);
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
      if (step === "name") {
        advance({ name: inputVal });
        return;
      }
      if (step === "contact") {
        if (contactMethod === "email") {
          advance({ contactMethod, email });
          return;
        }
        advance({ contactMethod, phoneCallingCode, phoneNational });
      }
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

      {/* ════ LEFT  form ════════════════════════════════════════════════ */}
      <div className="consult-left flex flex-col bg-white h-full overflow-hidden" style={{ opacity: 0 }}>

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

          {/* Step container  animated on transition */}
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
            {step === "contact" && (
              <div className="flex flex-col gap-5">
                <fieldset className="flex flex-col gap-3">
                  <legend className="sr-only">Preferred contact method</legend>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => { setContactMethod("whatsapp"); setInputErr(""); }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 border font-body font-medium transition-colors",
                        contactMethod === "whatsapp"
                          ? "border-primary bg-primary/[0.06] text-primary"
                          : "border-gray-200 text-secondary hover:border-primary/60 hover:bg-primary/[0.04]"
                      )}
                      style={{ fontSize: "0.875rem" }}
                    >
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => { setContactMethod("email"); setInputErr(""); }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 border font-body font-medium transition-colors",
                        contactMethod === "email"
                          ? "border-primary bg-primary/[0.06] text-primary"
                          : "border-gray-200 text-secondary hover:border-primary/60 hover:bg-primary/[0.04]"
                      )}
                      style={{ fontSize: "0.875rem" }}
                    >
                      Email
                    </button>
                  </div>
                </fieldset>

                {contactMethod === "whatsapp" ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-gray-400" style={{ fontSize: "0.78rem" }}>
                        WhatsApp number
                      </span>
                      <span className="font-body text-gray-400" style={{ fontSize: "0.78rem" }}>
                        {useCustomCallingCode ? "Enter code" : "Pick country"}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-2xl border px-3 py-2 bg-transparent",
                        "transition-colors duration-200",
                        inputErr ? "border-red-400" : "border-gray-200 focus-within:border-primary"
                      )}
                    >
                      {!useCustomCallingCode ? (
                        <select
                          value={phoneCallingCode}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "__custom__") {
                              setUseCustomCallingCode(true);
                              setPhoneCallingCode("+");
                              setInputErr("");
                              return;
                            }
                            setPhoneCallingCode(value);
                            setInputErr("");
                          }}
                          className={cn(
                            "bg-transparent font-body text-secondary outline-none",
                            "min-w-[92px] max-w-[140px] py-2 pr-2 border-0"
                          )}
                          style={{ fontSize: "1.0rem" }}
                          aria-label="Country calling code"
                        >
                          {COUNTRY_CALLING_CODES.map((opt) => (
                            <option key={`${opt.iso2}-${opt.callingCode}`} value={opt.callingCode}>
                              {formatCountryCallingCodeCompactLabel(opt)}
                            </option>
                          ))}
                          <option value="__custom__">Other…</option>
                        </select>
                      ) : (
                        <input
                          type="tel"
                          inputMode="tel"
                          placeholder="+1"
                          value={phoneCallingCode}
                          onChange={(e) => { setPhoneCallingCode(e.target.value); setInputErr(""); }}
                          className={cn(
                            "bg-transparent font-body text-secondary outline-none",
                            "min-w-[92px] max-w-[140px] py-2 pr-2 border-0"
                          )}
                          style={{ fontSize: "1.0rem" }}
                          aria-label="Custom calling code"
                        />
                      )}

                      <span className="h-6 w-px bg-gray-200" aria-hidden="true" />

                      <input
                        ref={inputRef}
                        type="tel"
                        autoComplete="tel-national"
                        inputMode="tel"
                        placeholder="55 120 4941"
                        value={phoneNational}
                        onChange={(e) => { setPhoneNational(e.target.value); setInputErr(""); }}
                        onKeyDown={handleKeyDown}
                        className={cn(
                          "flex-1 bg-transparent py-2 font-body text-secondary placeholder:text-gray-300 outline-none border-0"
                        )}
                        style={{ fontSize: "1.05rem" }}
                        aria-label="WhatsApp number"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-body text-gray-300" style={{ fontSize: "0.75rem" }}>
                        Example: {phoneCallingCode} 55 120 4941
                      </span>
                      {useCustomCallingCode && (
                        <button
                          type="button"
                          onClick={() => { setUseCustomCallingCode(false); setPhoneCallingCode("+233"); setInputErr(""); }}
                          className="font-body text-gray-400 hover:text-secondary transition-colors"
                          style={{ fontSize: "0.75rem" }}
                        >
                          back to country list
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={inputRef}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setInputErr(""); }}
                      onKeyDown={handleKeyDown}
                      className={cn(
                        "w-full bg-transparent pb-3 pt-1 font-body text-secondary placeholder:text-gray-300 outline-none",
                        "border-0 border-b-2 transition-colors duration-200",
                        inputErr ? "border-red-400" : "border-gray-200 focus:border-primary"
                      )}
                      style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
                    />
                  </div>
                )}

                {inputErr && (
                  <p className="mt-1 font-body text-red-400" style={{ fontSize: "0.78rem" }}>{inputErr}</p>
                )}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 font-body text-gray-300" style={{ fontSize: "0.75rem" }}>
                    <CornerDownLeft size={11} /> press Enter
                  </span>
                  <button
                    onClick={() => {
                      if (contactMethod === "email") {
                        advance({ contactMethod, email });
                        return;
                      }
                      advance({ contactMethod, phoneCallingCode, phoneNational });
                    }}
                    className="inline-flex items-center gap-2 bg-primary text-white font-heading font-semibold rounded-full px-5 py-2.5 hover:bg-primary-dark transition-all duration-200 shadow-[var(--shadow-primary)]"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {contactMethod === "email" ? "Send via Email" : "Send to WhatsApp"} <ArrowRight size={14} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  WhatsApp us
                </p>
                <p className="font-body text-gray-400" style={{ fontSize: "0.72rem" }}>
                  Message us  we respond within 24 hrs
                </p>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-[#25D366] transition-colors flex-shrink-0" />
            </a>

            <a
              href={`mailto:${BRAND.email}?subject=${encodeURIComponent("Consultation request")}&body=${encodeURIComponent("Hello Noir & Co! I'd like to book a consultation.")}`}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-gray-200 group hover:border-primary/40 hover:bg-primary/[0.04] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-secondary group-hover:text-primary transition-colors" style={{ fontSize: "0.8rem" }}>
                  Email us
                </p>
                <p className="font-body text-gray-400" style={{ fontSize: "0.72rem" }}>
                  Send a message to {BRAND.email}
                </p>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
            </a>
          </div>
        </div>

      </div>{/* end left panel */}

      {/* ════ RIGHT  slideshow ══════════════════════════════════════════ */}
      <div className="consult-right hidden lg:block relative overflow-hidden" style={{ opacity: 0 }}>
        <EventSlideshow />
      </div>

    </div>
  );
}
