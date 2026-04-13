// Phone detail page — /phones/:phoneId (e.g., /phones/samsung-galaxy-s24-ultra)
//
// Shows full phone specs, available plans with pricing,
// and a "similar phones" recommendations section.

import { useLoaderData } from "react-router";
import type { Route } from "./+types/phones.$phoneId";
import { queryGraphQL } from "~/lib/graphql-client";
import { GET_PHONE, GET_RECOMMENDATIONS } from "~/graphql/queries/phones";
import { formatPrice, formatStorage, formatBattery } from "~/lib/format";
import Badge from "~/components/ui/Badge/Badge";
import Button from "~/components/ui/Button/Button";
import PriceTag from "~/components/ui/PriceTag/PriceTag";
import Card from "~/components/ui/Card/Card";

// Loader — fetches phone data and recommendations before rendering
export async function loader({ params }: Route.LoaderArgs) {
  const phoneData = await queryGraphQL<{ phone: any }>(GET_PHONE, {
    slug: params.phoneId,
  });

  if (!phoneData.phone) {
    throw new Response("Phone not found", { status: 404 });
  }

  // Fetch recommendations in parallel would be ideal, but we need the phone ID first
  const recsData = await queryGraphQL<{ phoneRecommendations: any[] }>(
    GET_RECOMMENDATIONS,
    { phoneId: phoneData.phone.id, limit: 4 }
  );

  return {
    phone: phoneData.phone,
    recommendations: recsData.phoneRecommendations,
  };
}

export default function PhoneDetail() {
  const { phone, recommendations } = useLoaderData<typeof loader>();

  // Sort plans by monthly cost (cheapest first)
  const sortedPlans = [...phone.phonePlans].sort(
    (a: any, b: any) => a.monthly_cost_eur - b.monthly_cost_eur
  );

  return (
    <div>
      {/* Phone header */}
      <div style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-8)" }}>
        {/* Phone image */}
        <div
          style={{
            width: "300px",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--color-gray-50)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <span style={{ fontSize: "var(--text-4xl)", color: "var(--color-gray-300)" }}>
            {phone.phoneBrand.name.charAt(0)}
          </span>
        </div>

        {/* Phone info */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", textTransform: "uppercase" }}>
            {phone.phoneBrand.name}
          </p>
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
            {phone.name}
          </h1>

          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
            <Badge>{formatStorage(phone.storage_gb)}</Badge>
            <Badge>{phone.ram_gb} GB RAM</Badge>
            {phone.is_5g && <Badge variant="info">5G</Badge>}
            <Badge>{phone.os}</Badge>
          </div>

          <p style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)", marginBottom: "var(--space-4)" }}>
            {formatPrice(phone.price_eur)}
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", fontWeight: 400 }}> los toestel</span>
          </p>

          {/* Specs table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Scherm", phone.screen_size ? `${phone.screen_size}"` : "-"],
                ["Opslag", formatStorage(phone.storage_gb)],
                ["RAM", `${phone.ram_gb} GB`],
                ["Batterij", formatBattery(phone.battery_mah)],
                ["Camera", phone.camera_mp ? `${phone.camera_mp} MP` : "-"],
                ["Kleur", phone.color || "-"],
                ["Jaar", phone.release_year?.toString() || "-"],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: "1px solid var(--color-gray-100)" }}>
                  <td style={{ padding: "var(--space-2) 0", color: "var(--color-gray-500)", width: "120px", fontSize: "var(--text-sm)" }}>
                    {label}
                  </td>
                  <td style={{ padding: "var(--space-2) 0", fontWeight: 500, fontSize: "var(--text-sm)" }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available plans */}
      <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
        Beschikbare abonnementen ({sortedPlans.length})
      </h2>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {sortedPlans.map((pp: any) => (
          <Card key={pp.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontWeight: 600 }}>{pp.plan.provider.name} — {pp.plan.name}</p>
                <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
                  <Badge>{pp.plan.is_unlimited_data ? "Onbeperkt data" : `${pp.plan.data_gb} GB`}</Badge>
                  {pp.plan.network_type === "5G" && <Badge variant="info">5G</Badge>}
                  <Badge>{pp.plan.contract_months} mnd</Badge>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <PriceTag
                  monthlyPrice={pp.monthly_cost_eur}
                  upfrontPrice={pp.upfront_cost_eur}
                />
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-gray-400)", marginTop: "var(--space-1)" }}>
                  Totaal: {formatPrice(pp.total_cost_eur)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: "var(--space-12)" }}>
          <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
            Vergelijkbare telefoons
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
            {recommendations.map((rec: any) => (
              <Card key={rec.id} hoverable>
                <a href={`/phones/${rec.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-gray-500)" }}>{rec.phoneBrand.name}</p>
                  <p style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>{rec.name}</p>
                  <p style={{ color: "var(--color-primary)", fontWeight: 700 }}>{formatPrice(rec.price_eur)}</p>
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
