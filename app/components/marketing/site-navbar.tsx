import { auth } from "../../auth";
import SiteNavbarClient from "./site-navbar-client";

export default async function SiteNavbar() {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <SiteNavbarClient
      user={
        user
          ? {
              name: user.name ?? null,
              email: user.email ?? null,
              image: user.image ?? null,
            }
          : null
      }
    />
  );
}