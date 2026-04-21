import Link from "next/link";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import UserNav from "../../components/layout/user-nav";

export default async function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d10]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-black">
                T
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">Tenora</p>
                <p className="text-xs text-white/45">
                  Content engine for lean teams
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
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

          <UserNav
            name={user.name}
            email={user.email}
            image={user.image}
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              {subtitle}
            </p>
          ) : null}
        </div>

        {children}
      </main>
    </div>
  );
}