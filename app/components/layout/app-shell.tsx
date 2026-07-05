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
