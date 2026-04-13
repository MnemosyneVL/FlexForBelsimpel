// Phone comparison page — /compare?compare=1,2,3
//
// Side-by-side spec comparison for up to 4 phones.
// The phone IDs come from URL search params (managed by the useCompare hook).
//
// This is a common pattern on electronics retail sites:
// users can "add to compare" from any phone card, and this page
// renders a table where each column is a phone and each row is a spec.
//
// Architecture note: the loader fetches data server-side using the
// comparePhones GraphQL query. If no phones are selected, we show
// an empty state guiding the user to browse phones first.

import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/compare";
import { queryGraphQL } from "~/lib/graphql-client";
import { COMPARE_PHONES } from "~/graphql/queries/phones";
import { formatPrice, formatStorage, formatBattery } from "~/lib/format";
import Badge from "~/components/ui/Badge/Badge";
import Button from "~/components/ui/Button/Button";
import { useCompare } from "~/hooks/useCompare";

interface CompareData {
  comparePhones: Array<{
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    price_eur: number;
    storage_gb: number;
    ram_gb: number;
    battery_mah: number | null;
    screen_size: number | null;
    camera_mp: number | null;
    is_5g: boolean;
    os: string;
    color: string | null;
    release_year: number | null;
    phoneBrand: { name: string };
  }>;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const compareParam = url.searchParams.get("compare");

  // Nothing to compare — return empty array
  if (!compareParam) {
    return { phones: [] };
  }

  const ids = compareParam.split(",").filter(Boolean).slice(0, 4);

  if (ids.length === 0) {
    return { phones: [] };
  }

  const data = await queryGraphQL<CompareData>(COMPARE_PHONES, { ids });

  return { phones: data.comparePhones };
}

export default function ComparePage() {
  const { phones } = useLoaderData<typeof loader>();
  const { removeFromCompare } = useCompare();

  // Empty state — no phones selected for comparison
  if (phones.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-16) 0" }}>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
          Telefoons vergelijken
        </h1>
        <p style={{ color: "var(--color-gray-500)", marginBottom: "var(--space-6)" }}>
          Je hebt nog geen telefoons geselecteerd om te vergelijken.
          <br />
          Ga naar het telefoonoverzicht en klik op "Vergelijk" bij een telefoon.
        </p>
        <Link to="/phones">
          <Button>Bekijk telefoons</Button>
        </Link>
      </div>
    );
  }

  // The spec rows — each row shows one attribute across all selected phones.
  // This structure makes it easy to scan differences vertically.
  const specRows: Array<{ label: string; getValue: (phone: any) => string }> = [
    { label: "Merk", getValue: (p) => p.phoneBrand.name },
    { label: "Prijs (los)", getValue: (p) => formatPrice(p.price_eur) },
    { label: "Opslag", getValue: (p) => formatStorage(p.storage_gb) },
    { label: "RAM", getValue: (p) => `${p.ram_gb} GB` },
    { label: "Scherm", getValue: (p) => p.screen_size ? `${p.screen_size}"` : "-" },
    { label: "Batterij", getValue: (p) => formatBattery(p.battery_mah) },
    { label: "Camera", getValue: (p) => p.camera_mp ? `${p.camera_mp} MP` : "-" },
    { label: "5G", getValue: (p) => p.is_5g ? "Ja" : "Nee" },
    { label: "OS", getValue: (p) => p.os },
    { label: "Kleur", getValue: (p) => p.color || "-" },
    { label: "Jaar", getValue: (p) => p.release_year?.toString() || "-" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-6)" }}>
        Telefoons vergelijken ({phones.length})
      </h1>

      {/* Comparison table — phones as columns, specs as rows */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "var(--color-white)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <thead>
            <tr>
              {/* Empty corner cell */}
              <th style={{ width: "140px" }} />
              {/* Phone headers */}
              {phones.map((phone: any) => (
                <th
                  key={phone.id}
                  style={{
                    padding: "var(--space-4)",
                    textAlign: "center",
                    verticalAlign: "bottom",
                    borderBottom: "2px solid var(--color-gray-200)",
                  }}
                >
                  {/* Phone image placeholder */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      margin: "0 auto var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-gray-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--text-2xl)",
                      color: "var(--color-gray-300)",
                    }}
                  >
                    {phone.phoneBrand.name.charAt(0)}
                  </div>
                  <Link
                    to={`/phones/${phone.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>{phone.name}</div>
                  </Link>
                  <button
                    onClick={() => removeFromCompare(phone.id)}
                    style={{
                      marginTop: "var(--space-2)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-gray-400)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Verwijderen
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, index) => (
              <tr
                key={row.label}
                style={{
                  backgroundColor: index % 2 === 0 ? "var(--color-gray-50)" : "var(--color-white)",
                }}
              >
                <td
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-gray-600)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.label}
                </td>
                {phones.map((phone: any) => (
                  <td
                    key={phone.id}
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      textAlign: "center",
                      fontSize: "var(--text-sm)",
                      fontWeight: row.label === "Prijs (los)" ? 700 : 400,
                      color: row.label === "Prijs (los)" ? "var(--color-primary)" : "inherit",
                    }}
                  >
                    {row.getValue(phone)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA to browse more phones */}
      <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
        <Link to="/phones">
          <Button variant="secondary">Meer telefoons bekijken</Button>
        </Link>
      </div>
    </div>
  );
}
