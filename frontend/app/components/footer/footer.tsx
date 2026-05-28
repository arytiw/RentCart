import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const productLinksA = [
  { label: "Party & Events", href: "/items?category=Party%20and%20Events" },
  { label: "Gaming", href: "/items?category=Gaming" },
  { label: "Photography", href: "/items?category=Photography" },
  { label: "Music", href: "/items?category=Music" },
];

const productLinksB = [
  { label: "Kitchen", href: "/items?category=Kitchen" },
  { label: "Books", href: "/items?category=Books" },
  { label: "Transport", href: "/items?category=Transport" },
  { label: "Fitness", href: "/items?category=Fitness" },
];

const companyLinks = [
  { label: "Support", href: "/support-chat" },
  { label: "List your item", href: "/rent" },
  { label: "Browse all", href: "/items" },
  { label: "My Dashboard", href: "/dashboard" },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink text-cream-100 mt-12" data-testid="site-footer">
      {/* top hairline + soft glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-16 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-soft">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.55h8.2a2 2 0 0 0 1.96-1.6L21 8H6"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                  <circle cx="10" cy="20" r="1.4" fill="currentColor" />
                  <circle cx="17" cy="20" r="1.4" fill="currentColor" />
                </svg>
              </span>
              <span className="font-display font-bold text-2xl tracking-tighter2 text-white">
                Rent<span className="text-brand">Cart</span>
              </span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-300">
              Rent anything you need from a trusted community. Verified items,
              instant booking, and secure payments — all in one premium marketplace.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-2">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 hover:text-white hover:border-brand hover:bg-brand/10 transition-all duration-200"
                  aria-label="social link"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories A */}
          <div className="col-span-1 md:col-span-2">
            <h6 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-300 mb-4">
              Categories
            </h6>
            <ul className="space-y-2.5">
              {productLinksA.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center text-sm text-ink-200 hover:text-white transition-colors"
                  >
                    {l.label}
                    <FiArrowUpRight className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories B */}
          <div className="col-span-1 md:col-span-2">
            <h6 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-300 mb-4">
              More
            </h6>
            <ul className="space-y-2.5">
              {productLinksB.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center text-sm text-ink-200 hover:text-white transition-colors"
                  >
                    {l.label}
                    <FiArrowUpRight className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-2 md:col-span-3">
            <h6 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-300 mb-4">
              Company
            </h6>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center text-sm text-ink-200 hover:text-white transition-colors"
                  >
                    {l.label}
                    <FiArrowUpRight className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} RentCart. Crafted with care.
          </p>
          <p className="text-xs text-ink-400">
            <span className="text-ink-300">v2.0</span> · UI refreshed for the modern web
          </p>
        </div>
      </div>
    </footer>
  );
}
