import SiteNavbar from "@/app/components/marketing/site-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  );
}
