// Phones layout — wraps all /phones/* routes.
//
// This is a "layout route" — it stays rendered while child routes
// (phone listing, phone detail) swap in and out via <Outlet />.
// We use it to provide a consistent section header.

import { Outlet } from "react-router";

export default function PhonesLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
