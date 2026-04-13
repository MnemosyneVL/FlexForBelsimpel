// Landing page — "Hello Belsimpel!"
//
// This is the first page a Belsimpel recruiter will see.
// It demonstrates:
//   - Why this project exists (job application showcase)
//   - The full tech stack used and how each piece maps to Belsimpel's requirements
//   - Featured phones from the database
//   - The system architecture (ASCII diagram)
//
// The loader fetches featured phones via GraphQL so the page is
// server-rendered with real data — not just static markup.

import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/_index";
import { queryGraphQL } from "~/lib/graphql-client";
import { GET_FEATURED_PHONES } from "~/graphql/queries/phones";
import { formatPrice } from "~/lib/format";
import Button from "~/components/ui/Button/Button";
import Card from "~/components/ui/Card/Card";
import Badge from "~/components/ui/Badge/Badge";

interface FeaturedPhone {
  id: string;
  name: string;
  slug: string;
  price_eur: number;
  storage_gb: number;
  is_5g: boolean;
  os: string;
  phoneBrand: { name: string };
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const data = await queryGraphQL<{ phones: { data: FeaturedPhone[] } }>(
      GET_FEATURED_PHONES,
      { first: 6, page: 1 }
    );
    return { phones: data.phones.data };
  } catch {
    // If the API isn't running yet, show the page without phones
    return { phones: [] };
  }
}

// The tech stack items — each maps to a Belsimpel vacancy requirement
const techStack = [
  {
    name: "PHP 8.3 + Laravel 11",
    role: "Backend framework",
    description: "RESTful API, Eloquent ORM, migrations, queue jobs, observers, events",
    color: "#7b7fb5",
  },
  {
    name: "GraphQL (Lighthouse)",
    role: "API layer",
    description: "Typed schema, custom resolvers, batched queries, subscriptions-ready",
    color: "#e535ab",
  },
  {
    name: "MariaDB 11.2",
    role: "Primary database",
    description: "8 tables, foreign keys, indexes, pivot tables with pricing",
    color: "#003545",
  },
  {
    name: "Redis 7.2",
    role: "Cache, sessions, rate limiting",
    description: "Query caching (5min TTL), session store, API rate limiter (60/min)",
    color: "#dc382d",
  },
  {
    name: "Elasticsearch 8.12",
    role: "Search engine",
    description: "Full-text search with fuzzy matching, faceted filters, aggregations",
    color: "#fed10a",
  },
  {
    name: "RabbitMQ 3.13",
    role: "Message queue",
    description: "Async ES sync, price notifications, recommendation processing",
    color: "#ff6600",
  },
  {
    name: "React 18 + TypeScript",
    role: "Frontend framework",
    description: "Component architecture, hooks, type safety, SSR-compatible",
    color: "#61dafb",
  },
  {
    name: "React Router v7",
    role: "Full-stack framework",
    description: "File routing, SSR, loaders, actions — successor to Remix",
    color: "#f44250",
  },
  {
    name: "Vite 6",
    role: "Build tool",
    description: "HMR, CSS Modules, TypeScript, dev proxy, production bundling",
    color: "#646cff",
  },
  {
    name: "CSS Modules",
    role: "Scoped styling",
    description: "Component-level styles, no class collisions, design token variables",
    color: "#1572b6",
  },
  {
    name: "Docker Compose",
    role: "Infrastructure",
    description: "8 services: nginx, php, node, mariadb, redis, ES, rabbitmq, mailpit",
    color: "#2496ed",
  },
  {
    name: "GitLab CI/CD",
    role: "Pipeline",
    description: "Lint, test, build, and deploy stages with Docker-in-Docker",
    color: "#fc6d26",
  },
];

export default function LandingPage() {
  const { phones } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Hero section */}
      <section style={{ textAlign: "center", padding: "var(--space-16) 0 var(--space-12)" }}>
        <Badge variant="info" style={{ marginBottom: "var(--space-4)", display: "inline-block" }}>
          Showcase Project
        </Badge>
        <h1 style={{ fontSize: "var(--text-4xl)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
          Hallo{" "}
          <span style={{ color: "var(--color-primary)" }}>Belsimpel</span>!
        </h1>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-gray-600)",
            maxWidth: "640px",
            margin: "0 auto var(--space-6)",
            lineHeight: 1.6,
          }}
        >
          Dit is <strong>FlexForBelsimpel</strong> — een telefoon- en abonnementenvergelijker
          gebouwd met jullie volledige tech stack. Van PHP en Laravel tot React en Elasticsearch,
          alles draait in Docker, precies zoals bij Belsimpel.
        </p>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-gray-500)",
            marginBottom: "var(--space-8)",
          }}
        >
          Gebouwd door <strong>Chiril Ojoga</strong> als sollicitatie-showcase
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
          <Link to="/phones">
            <Button>Bekijk telefoons</Button>
          </Link>
          <Link to="/plans">
            <Button variant="secondary">Bekijk abonnementen</Button>
          </Link>
        </div>
      </section>

      {/* Tech stack grid */}
      <section style={{ marginBottom: "var(--space-16)" }}>
        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-2)" }}>
          De volledige Belsimpel-stack
        </h2>
        <p style={{ textAlign: "center", color: "var(--color-gray-500)", marginBottom: "var(--space-8)" }}>
          Elke technologie uit de vacature, daadwerkelijk in gebruik
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {techStack.map((tech) => (
            <Card key={tech.name}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: tech.color,
                    marginTop: "6px",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{tech.name}</h3>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: 500 }}>
                    {tech.role}
                  </p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-gray-500)", marginTop: "var(--space-1)" }}>
                    {tech.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured phones */}
      {phones.length > 0 && (
        <section style={{ marginBottom: "var(--space-16)" }}>
          <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-2)" }}>
            Uitgelichte telefoons
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-gray-500)", marginBottom: "var(--space-8)" }}>
            Live data uit MariaDB, doorzoekbaar via Elasticsearch
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {phones.map((phone) => (
              <Card key={phone.id} hoverable>
                <Link to={`/phones/${phone.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    style={{
                      height: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--color-gray-50)",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "var(--space-3)",
                      fontSize: "var(--text-2xl)",
                      color: "var(--color-gray-300)",
                    }}
                  >
                    {phone.phoneBrand.name.charAt(0)}
                  </div>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-gray-500)" }}>
                    {phone.phoneBrand.name}
                  </p>
                  <p style={{ fontWeight: 600, fontSize: "var(--text-sm)", marginBottom: "var(--space-2)" }}>
                    {phone.name}
                  </p>
                  <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
                    {phone.is_5g && <Badge variant="info">5G</Badge>}
                    <Badge>{phone.storage_gb} GB</Badge>
                  </div>
                  <p style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                    {formatPrice(phone.price_eur)}
                  </p>
                </Link>
              </Card>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
            <Link to="/phones">
              <Button variant="secondary">Alle telefoons bekijken</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Architecture diagram */}
      <section style={{ marginBottom: "var(--space-16)" }}>
        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-2)" }}>
          Architectuur
        </h2>
        <p style={{ textAlign: "center", color: "var(--color-gray-500)", marginBottom: "var(--space-8)" }}>
          Hoe alle services samenwerken in Docker Compose
        </p>

        <Card>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              lineHeight: 1.5,
              overflowX: "auto",
              padding: "var(--space-4)",
              color: "var(--color-gray-700)",
            }}
          >
{`┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│    React 18 + TypeScript + React Router v7 (SSR)            │
│    CSS Modules · urql GraphQL client                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   NGINX (Reverse Proxy)                       │
│       /graphql → PHP-FPM       /* → Node SSR (port 3000)    │
└───────────┬────────────────────────────┬────────────────────┘
            │                            │
            ▼                            ▼
┌───────────────────────┐  ┌─────────────────────────────────┐
│  LARAVEL (PHP 8.3)    │  │   REACT ROUTER v7 (Node 20)    │
│                       │  │                                  │
│  Lighthouse GraphQL   │  │   SSR · Loaders · Actions       │
│  Eloquent ORM         │  │   Vite dev server               │
│  Sanctum Auth         │  └─────────────────────────────────┘
│  Queue Jobs           │
│  Observers / Events   │
└──┬────┬────┬────┬─────┘
   │    │    │    │
   ▼    ▼    ▼    ▼
┌──────┐ ┌─────┐ ┌──────────────┐ ┌──────────┐
│Maria │ │Redis│ │Elasticsearch │ │ RabbitMQ │
│  DB  │ │     │ │              │ │          │
│      │ │Cache│ │ phones idx   │ │ search-  │
│phones│ │Sess.│ │ plans idx    │ │ sync     │
│plans │ │Rate │ │              │ │ notifs   │
│users │ │Limit│ │ Fuzzy search │ │ recomm.  │
└──────┘ └─────┘ └──────────────┘ └──────────┘`}
          </pre>
        </Card>
      </section>

      {/* Features overview */}
      <section style={{ marginBottom: "var(--space-16)" }}>
        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-8)" }}>
          Wat kan FlexForBelsimpel?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {[
            {
              title: "Telefoons zoeken",
              description: "Elasticsearch-powered zoeken met fuzzy matching en faceted filters op merk, prijs en opslag.",
              link: "/phones",
            },
            {
              title: "Abonnementen vergelijken",
              description: "Filter op provider, data, netwerk (4G/5G) en contract­duur. Real-time facet counts.",
              link: "/plans",
            },
            {
              title: "Telefoons vergelijken",
              description: "Selecteer tot 4 telefoons en bekijk de specificaties naast elkaar in een overzichtelijke tabel.",
              link: "/compare",
            },
            {
              title: "Verlanglijstje",
              description: "Bewaar favorieten en stel prijsalerts in. Meldingen via RabbitMQ → Queue → Mailpit.",
              link: "/wishlist",
            },
            {
              title: "GraphQL API",
              description: "Lighthouse-powered schema met custom resolvers, caching, en Sanctum-authenticatie.",
              link: "/about",
            },
            {
              title: "Storybook UI",
              description: "Interactieve component-catalogus met Button, Card, Badge, PriceTag en meer.",
              link: "/about",
            },
          ].map((feature) => (
            <Card key={feature.title} hoverable>
              <Link to={feature.link} style={{ textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>{feature.title}</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-500)", lineHeight: 1.5 }}>
                  {feature.description}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
