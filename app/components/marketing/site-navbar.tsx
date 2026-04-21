import Link from "next/link";
import { auth } from "../../auth";
import UserNav from "../../components/layout/user-nav";

export default async function SiteNavbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d10]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-black">
              T
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">
                Tenora
              </p>
              <p className="text-xs text-white/45">
                Content engine for lean teams
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/compose"
              className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Compose
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <UserNav
              name={user.name}
              email={user.email}
              image={user.image}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}