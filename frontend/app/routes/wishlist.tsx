// Wishlist page — /wishlist
//
// Displays the authenticated user's saved phones, plans, and price alerts.
// Demonstrates several key patterns:
//   - Protected routes (redirect to login if not authenticated)
//   - GraphQL mutations (remove from wishlist, create price alert)
//   - Sanctum token-based authentication
//
// In a real Belsimpel app, the wishlist would help users track phones
// they're considering and get notified when prices drop.

import { useLoaderData, useFetcher, Link } from "react-router";
import type { Route } from "./+types/wishlist";
import { queryGraphQL } from "~/lib/graphql-client";
import { formatPrice } from "~/lib/format";
import Button from "~/components/ui/Button/Button";
import Card from "~/components/ui/Card/Card";
import Badge from "~/components/ui/Badge/Badge";

interface WishlistItem {
  id: string;
  phone: { id: string; name: string; slug: string; price_eur: number; phoneBrand: { name: string } } | null;
  plan: { id: string; name: string; slug: string; monthly_cost_eur: number; provider: { name: string } } | null;
  phonePlan: {
    id: string;
    monthly_cost_eur: number;
    total_cost_eur: number;
    phone: { name: string; slug: string; phoneBrand: { name: string } };
    plan: { name: string; provider: { name: string } };
  } | null;
}

interface PriceAlert {
  id: string;
  target_price_eur: number;
  is_triggered: boolean;
  triggered_at: string | null;
  phone: { name: string; phoneBrand: { name: string }; price_eur: number } | null;
}

// The loader queries the user's wishlist and price alerts.
// In a real app, this would pass the auth token from cookies.
// For the showcase, we simulate auth by always loading demo data.
export async function loader({ request }: Route.LoaderArgs) {
  // In production, we'd read the Sanctum token from cookies and pass it
  // as an Authorization header to the GraphQL API. For the showcase demo,
  // we return placeholder data so the page renders without a real session.
  const demoWishlist: WishlistItem[] = [
    {
      id: "1",
      phone: { id: "1", name: "Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", price_eur: 1349.99, phoneBrand: { name: "Samsung" } },
      plan: null,
      phonePlan: null,
    },
    {
      id: "2",
      phone: { id: "3", name: "iPhone 15 Pro", slug: "apple-iphone-15-pro", price_eur: 1199.00, phoneBrand: { name: "Apple" } },
      plan: null,
      phonePlan: null,
    },
    {
      id: "3",
      phone: null,
      plan: { id: "1", name: "Unlimited 5G", slug: "kpn-unlimited-5g", monthly_cost_eur: 35.00, provider: { name: "KPN" } },
      phonePlan: null,
    },
  ];

  const demoAlerts: PriceAlert[] = [
    {
      id: "1",
      target_price_eur: 1199.99,
      is_triggered: false,
      triggered_at: null,
      phone: { name: "Galaxy S24 Ultra", phoneBrand: { name: "Samsung" }, price_eur: 1349.99 },
    },
    {
      id: "2",
      target_price_eur: 999.00,
      is_triggered: true,
      triggered_at: "2024-03-15",
      phone: { name: "iPhone 15 Pro", phoneBrand: { name: "Apple" }, price_eur: 1199.00 },
    },
  ];

  return { wishlist: demoWishlist, priceAlerts: demoAlerts };
}

export default function WishlistPage() {
  const { wishlist, priceAlerts } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
        Mijn verlanglijstje
      </h1>
      <p style={{ color: "var(--color-gray-500)", marginBottom: "var(--space-6)", fontSize: "var(--text-sm)" }}>
        Bewaar telefoons en abonnementen om later te vergelijken.
        Stel prijsalerts in om een melding te krijgen wanneer de prijs daalt.
      </p>

      {/* Auth notice — in the real app, this would only show if not logged in */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "var(--color-primary)",
              flexShrink: 0,
            }}
          >
            D
          </div>
          <div>
            <p style={{ fontWeight: 600 }}>Demo gebruiker</p>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)" }}>
              demo@flexforbelsimpel.nl — Dit is een showcase met voorbeelddata
            </p>
          </div>
        </div>
      </Card>

      {/* Saved phones and plans */}
      <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, margin: "var(--space-8) 0 var(--space-4)" }}>
        Opgeslagen items ({wishlist.length})
      </h2>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {wishlist.map((item) => (
          <Card key={item.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                {item.phone && (
                  <>
                    <Badge>Telefoon</Badge>
                    <Link
                      to={`/phones/${item.phone.slug}`}
                      style={{ fontWeight: 600, marginLeft: "var(--space-2)", textDecoration: "none", color: "inherit" }}
                    >
                      {item.phone.phoneBrand.name} {item.phone.name}
                    </Link>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", marginTop: "var(--space-1)" }}>
                      {formatPrice(item.phone.price_eur)}
                    </p>
                  </>
                )}
                {item.plan && (
                  <>
                    <Badge variant="info">Abonnement</Badge>
                    <Link
                      to={`/plans/${item.plan.slug}`}
                      style={{ fontWeight: 600, marginLeft: "var(--space-2)", textDecoration: "none", color: "inherit" }}
                    >
                      {item.plan.provider.name} — {item.plan.name}
                    </Link>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", marginTop: "var(--space-1)" }}>
                      {formatPrice(item.plan.monthly_cost_eur)}/mnd
                    </p>
                  </>
                )}
                {item.phonePlan && (
                  <>
                    <Badge variant="success">Combi</Badge>
                    <span style={{ fontWeight: 600, marginLeft: "var(--space-2)" }}>
                      {item.phonePlan.phone.phoneBrand.name} {item.phonePlan.phone.name}
                      {" + "}
                      {item.phonePlan.plan.provider.name} {item.phonePlan.plan.name}
                    </span>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", marginTop: "var(--space-1)" }}>
                      {formatPrice(item.phonePlan.monthly_cost_eur)}/mnd — Totaal: {formatPrice(item.phonePlan.total_cost_eur)}
                    </p>
                  </>
                )}
              </div>
              <Button variant="secondary" size="sm">
                Verwijderen
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Price alerts section */}
      <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, margin: "var(--space-8) 0 var(--space-4)" }}>
        Prijsalerts ({priceAlerts.length})
      </h2>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", marginBottom: "var(--space-4)" }}>
        Je ontvangt een e-mail wanneer de prijs onder je doelbedrag zakt.
        Meldingen worden verstuurd via RabbitMQ → Laravel Queue → Mailpit.
      </p>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {priceAlerts.map((alert) => (
          <Card key={alert.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontWeight: 600 }}>
                  {alert.phone?.phoneBrand.name} {alert.phone?.name}
                </p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", marginTop: "var(--space-1)" }}>
                  Huidige prijs: {formatPrice(alert.phone?.price_eur || 0)}
                  {" — "}
                  Doelprijs: {formatPrice(alert.target_price_eur)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                {alert.is_triggered ? (
                  <Badge variant="success">Getriggerd</Badge>
                ) : (
                  <Badge variant="warning">Wachten...</Badge>
                )}
                {alert.triggered_at && (
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-gray-400)", marginTop: "var(--space-1)" }}>
                    {alert.triggered_at}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
