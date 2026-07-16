"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface SiteNavbarClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/compose", label: "Compose" },
];

export default function SiteNavbarClient({ user }: SiteNavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  // Close mobile menu on route change
  // Close mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .trim()
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d10]/80 backdrop-blur-xl"
    >
      {/* ── Top bar ── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-black">
            T
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-wide text-white leading-tight">
              Tenora
            </p>
            <p className="text-xs leading-tight text-white/45">
              Content engine for lean teams
            </p>
          </div>
          <p className="text-sm font-semibold tracking-wide text-white sm:hidden">
            Tenora
          </p>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm transition hover:bg-white/5 hover:text-white ${
                pathname === link.href
                  ? "font-medium text-white"
                  : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* ── Desktop user dropdown ── */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 transition hover:bg-white/[0.06]"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? "User"}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-xs font-semibold text-black">
                      {initials}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate text-sm font-medium text-white">
                    {user.name ?? "User"}
                  </span>
                  {/* Chevron */}
                  <svg
                    className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/10 bg-[#11161c] p-1.5 shadow-2xl shadow-black/40">
                    <div className="border-b border-white/10 px-3 py-2.5 mb-1">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name ?? "User"}
                      </p>
                      <p className="text-xs text-white/45 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-300 transition hover:bg-white/5"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile: just the avatar as the toggle trigger (no extra button) */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="flex h-9 w-9 shrink-0 items-center justify-center md:hidden"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-xs font-semibold text-black ring-2 ring-white/10">
                    {initials}
                  </div>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Desktop auth buttons */}
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-emerald-300 active:bg-emerald-500"
                >
                  Get started
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
              >
                {menuOpen ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="border-t border-white/10 px-4 pb-5 pt-3">
          {/* Nav links */}
          <nav className="mb-3 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-xl px-4 py-3 text-sm transition hover:bg-white/5 ${
                  pathname === link.href
                    ? "bg-white/5 font-medium text-white"
                    : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Divider */}
          <div className="mb-3 h-px bg-white/10" />
          {/* User info strip (logged-in) */}
          {user && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-black">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-white/45">{user.email}</p>
              </div>
            </div>
          )}

          {/* Auth actions */}
          {user ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-400/10 active:bg-rose-400/15"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300 active:bg-emerald-500"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
