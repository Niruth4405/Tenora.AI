"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface UserNavProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function UserNav({ name, email, image }: UserNavProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:bg-white/[0.06]"
      >
        {image ? (
          <Image
            src={image}
            alt={name ?? "User"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-black">
            {initials}
          </div>
        )}

        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-white">{name ?? "User"}</p>
          <p className="max-w-[160px] truncate text-xs text-white/45">
            {email ?? ""}
          </p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-3 w-56 rounded-2xl border border-white/10 bg-[#11161c] p-2 shadow-2xl shadow-black/30">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
