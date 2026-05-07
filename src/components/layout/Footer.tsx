import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { IconInstagram, IconX, IconFacebook, IconLinkedin } from "@/components/ui/SocialIcons";
import { BRAND, NAV_LINKS, SERVICES } from "@/lib/constants";
import { Container } from "@/components/ui";

const SOCIALS = [
  { icon: IconInstagram, href: BRAND.social.instagram, label: "Instagram" },
  { icon: IconX,         href: BRAND.social.twitter,   label: "Twitter"   },
  // { icon: IconFacebook,  href: BRAND.social.facebook,  label: "Facebook"  },
  { icon: IconLinkedin,  href: BRAND.social.linkedin,  label: "LinkedIn"  },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt={BRAND.name}
                width={1100}
                height={1100}
                className="h-10 w-auto scale-110"
              />
            </div>
            <p className="text-gray-400 font-body text-body-sm leading-relaxed max-w-sm mb-6">
              {BRAND.description}
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-body-sm uppercase tracking-widest text-gray-400 mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href="#services"
                    className="font-body text-body-sm text-gray-300 hover:text-primary transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-body-sm uppercase tracking-widest text-gray-400 mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-primary mt-1 shrink-0" />
                <span className="font-body text-body-sm text-gray-300">{BRAND.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-primary mt-1 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-body text-body-sm text-gray-300">{BRAND.phone}</span>
                  <span className="font-body text-body-sm text-gray-300">{BRAND.phoneSec}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-primary mt-1 shrink-0" />
                <span className="font-body text-body-sm text-gray-300">{BRAND.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-caption text-gray-500">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-body text-caption text-gray-500 hover:text-gray-300 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
