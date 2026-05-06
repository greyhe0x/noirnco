"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeInOptions {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/** Fades in a container's direct children when the container enters the viewport. */
export function useGsapFadeIn<T extends HTMLElement = HTMLDivElement>(
  options: FadeInOptions = {}
) {
  const ref = useRef<T>(null);
  const { y = 40, x = 0, duration = 0.8, delay = 0, stagger = 0.12, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(":scope > *");
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y, x },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: once ? "play none none none" : "play none none reset",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, x, duration, delay, stagger, once]);

  return ref;
}

/** Animates a single element (not children) on scroll. */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: Omit<FadeInOptions, "stagger"> = {}
) {
  const ref = useRef<T>(null);
  const { y = 40, x = 0, duration = 0.9, delay = 0, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, x },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: once ? "play none none none" : "play none none reset",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, x, duration, delay, once]);

  return ref;
}
