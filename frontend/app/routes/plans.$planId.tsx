// Plan detail page — /plans/:planId (e.g., /plans/kpn-unlimited-5g)
//
// Shows full plan details and all phones available with this plan.
// Each phone+plan combo has its own pricing (monthly, upfront, total).
//
// This demonstrates the many-to-many relationship between phones and plans
// through the phone_plans pivot table — a common pattern in e-commerce.

import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/plans.$planId";
import { queryGraphQL } from "~/lib/graphql-client";
import { GET_PLAN } from "~/graphql/queries/plans";
import { formatPrice, formatData, formatMinutes } from "~/lib/format";
import Badge from "~/components/ui/Badge/Badge";
import Card from "~/components/ui/Card/Card";
import PriceTag from "~/components/ui/PriceTag/PriceTag";

// Loader — runs server-side, fetches the plan with all linked phones
export async function loader({ params }: Route.LoaderArgs) {
  const data = await queryGraphQL<{ plan: any }>(GET_PLAN, {
    slug: params.planId,
  });

  if (!data.plan) {
    throw new Response("Plan not found", { status: 404 });
  }

  return { plan: data.plan };
}

export default function PlanDetail() {
  const { plan } = useLoaderData<typeof loader>();

  // Sort phones by monthly cost — cheapest combo first
  const sortedPhonePlans = [...plan.phonePlans].sort(
    (a: any, b: any) => a.monthly_cost_eur - b.monthly_cost_eur
  );

  return (
    <div>
      {/* Plan header */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", textTransform: "uppercase" }}>
          {plan.provider.name}
        </p>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
          {plan.name}
        </h1>

        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
          {plan.network_type === "5G" && <Badge variant="info">5G</Badge>}
          {plan.is_unlimited_data && <Badge variant="success">Onbeperkt data</Badge>}
          {plan.is_unlimited_calls && <Badge variant="success">Onbeperkt bellen</Badge>}
          <Badge>{plan.contract_months} maanden</Badge>
        </div>

        <p style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)" }}>
          {formatPrice(plan.monthly_cost_eur)}
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", fontWeight: 400 }}> /mnd (SIM only)</span>
        </p>
      </div>

      {/* Plan specs */}
      <Card>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
          Abonnement details
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Provider", plan.provider.name],
              ["Data", formatData(plan.data_gb, plan.is_unlimited_data)],
              ["Bellen", formatMinutes(plan.minutes, plan.is_unlimited_calls)],
              ["SMS", plan.sms ? `${plan.sms} sms` : "Onbeperkt"],
              ["Netwerk", plan.network_type],
              ["Looptijd", `${plan.contract_months} maanden`],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid var(--color-gray-100)" }}>
                <td style={{ padding: "var(--space-2) 0", color: "var(--color-gray-500)", width: "140px", fontSize: "var(--text-sm)" }}>
                  {label}
                </td>
                <td style={{ padding: "var(--space-2) 0", fontWeight: 500, fontSize: "var(--text-sm)" }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Available phones with this plan */}
      <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, margin: "var(--space-8) 0 var(--space-4)" }}>
        Beschikbare telefoons ({sortedPhonePlans.length})
      </h2>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {sortedPhonePlans.map((pp: any) => (
          <Card key={pp.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                {/* Phone image placeholder */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-gray-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-gray-400)",
                    flexShrink: 0,
                  }}
                >
                  {pp.phone.phoneBrand.name.charAt(0)}
                </div>
                <div>
                  <Link
                    to={`/phones/${pp.phone.slug}`}
                    style={{ fontWeight: 600, textDecoration: "none", color: "inherit" }}
                  >
                    {pp.phone.phoneBrand.name} {pp.phone.name}
                  </Link>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)" }}>
                    Los toestel: {formatPrice(pp.phone.price_eur)}
                  </p>
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

      {/* Provider link */}
      {plan.provider.website_url && (
        <p style={{ marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-gray-500)" }}>
          Bekijk meer op{" "}
          <a
            href={plan.provider.website_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-primary)" }}
          >
            {plan.provider.name}
          </a>
        </p>
      )}
    </div>
  );
}
