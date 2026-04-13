// About page — /about
//
// Explains the architecture and technology choices in detail.
// This page is aimed at Belsimpel's technical recruiters and developers
// so they can understand the "why" behind every decision.

import Card from "~/components/ui/Card/Card";
import Badge from "~/components/ui/Badge/Badge";

// Each section explains a technology choice and maps it to Belsimpel's stack
const sections = [
  {
    title: "Backend: PHP 8.3 + Laravel 11",
    badge: "Backend",
    points: [
      "Laravel 11's slim app structure — bootstrap/app.php replaces the old kernel classes",
      "Eloquent ORM with 8 models, proper relationships (belongsTo, hasMany, belongsToMany)",
      "Database migrations with foreign keys, indexes, and decimal precision for prices",
      "Seeders with realistic Dutch market data (25 phones, 18 plans, ~450 price combos)",
      "Model observers that dispatch queue jobs when data changes",
      "Event-driven architecture: PriceChanged event → HandlePriceChange listener → alert notifications",
    ],
  },
  {
    title: "API: GraphQL with Lighthouse",
    badge: "API",
    points: [
      "Schema-first approach: types and queries defined in .graphql files, not PHP code",
      "Split into domain files: phone.graphql, plan.graphql, wishlist.graphql, auth.graphql",
      "Custom resolvers for complex queries (search, compare, recommendations)",
      "Input types for filters with proper nullable fields",
      "Sanctum-based authentication for protected mutations (wishlist, price alerts)",
    ],
  },
  {
    title: "Database: MariaDB 11.2",
    badge: "Database",
    points: [
      "8 domain tables + 3 job infrastructure tables",
      "Pivot table (phone_plans) with calculated pricing — monthly, upfront, and total costs",
      "Proper indexes on foreign keys and commonly filtered columns (slug, is_active)",
      "Decimal(8,2) for all money columns — never use floats for currency",
      "Europe/Amsterdam timezone matching Belsimpel's location",
    ],
  },
  {
    title: "Cache & Sessions: Redis 7.2",
    badge: "Infrastructure",
    points: [
      "Three separate Redis databases: default (0), cache (1), session (2)",
      "Query result caching with 5-minute TTL for search results",
      "24-hour cache for recommendation queries (content doesn't change often)",
      "Session storage — faster than database sessions, supports horizontal scaling",
      "API rate limiting: 60 requests/minute for guests, 120 for authenticated users",
    ],
  },
  {
    title: "Search: Elasticsearch 8.12",
    badge: "Search",
    points: [
      "Two indices: flex_phones and flex_plans with explicit field mappings",
      "Multi-field matching with fuzziness for typo tolerance ('samung' → 'samsung')",
      "Faceted filters using Elasticsearch aggregations (brand, price range, storage)",
      "Bool queries combining must (search terms) + filter (exact matches) clauses",
      "Custom indexing commands with progress bars (php artisan es:index-phones)",
    ],
  },
  {
    title: "Message Queue: RabbitMQ 3.13",
    badge: "Async",
    points: [
      "Three named queues: search-sync, notifications, recommendations",
      "Automatic ES sync: phone/plan create/update/delete dispatches sync jobs",
      "Price alert notifications: price drop → find matching alerts → send emails",
      "Supervisord runs queue workers alongside PHP-FPM in the same container",
      "Management UI available at port 15672 for monitoring",
    ],
  },
  {
    title: "Frontend: React 18 + TypeScript + React Router v7",
    badge: "Frontend",
    points: [
      "React Router v7 in framework mode — the official successor to Remix v2",
      "Server-side rendering (SSR) — pages load with data, no loading spinners",
      "Loaders fetch data on the server before the component renders",
      "URL-driven state — all search filters stored in search params (shareable, bookmarkable)",
      "urql as the GraphQL client — ~5KB vs Apollo's ~30KB, perfect for SSR",
    ],
  },
  {
    title: "Styling: CSS Modules + Design Tokens",
    badge: "Styling",
    points: [
      "CSS Modules for component-scoped styles — no class name collisions",
      "CSS custom properties (variables) for the entire design system",
      "Belsimpel-inspired color palette: orange (#ff6b00) primary accent",
      "Consistent spacing scale, typography, shadows, and border radius",
      "No CSS framework — hand-written styles demonstrate CSS proficiency",
    ],
  },
  {
    title: "Testing: Jest + PHPUnit",
    badge: "Testing",
    points: [
      "PHPUnit for backend: model relationships, GraphQL queries, auth mutations",
      "Jest + Testing Library for frontend: component rendering, user interactions",
      "Storybook 8 for visual component testing and documentation",
      "Test isolation: array cache + sync queue driver in test environment",
    ],
  },
  {
    title: "Infrastructure: Docker Compose",
    badge: "DevOps",
    points: [
      "8 interconnected services with health checks and dependency ordering",
      "Nginx reverse proxy: /graphql → PHP-FPM, everything else → Node SSR",
      "Volume mounts for hot-reloading in development",
      "Named network (flex-network) for service discovery",
      "GitLab CI/CD pipeline config with lint, test, build, and deploy stages",
    ],
  },
];

export default function AboutPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
        Over FlexForBelsimpel
      </h1>
      <p style={{ color: "var(--color-gray-600)", marginBottom: "var(--space-8)", lineHeight: 1.6, maxWidth: "720px" }}>
        Dit project is gebouwd als showcase voor mijn sollicitatie bij Belsimpel.
        Hieronder leg ik uit welke technologieën ik heb gebruikt en waarom,
        zodat je kunt zien hoe ik met jullie stack werk.
      </p>

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "var(--space-12)",
        }}
      >
        {[
          { label: "Docker services", value: "8" },
          { label: "Database tables", value: "11" },
          { label: "GraphQL types", value: "15+" },
          { label: "React components", value: "20+" },
          { label: "Storybook stories", value: "10+" },
          { label: "Lines of code", value: "5000+" },
        ].map((stat) => (
          <Card key={stat.label}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)" }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-gray-500)" }}>
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Technology sections */}
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {sections.map((section) => (
          <Card key={section.title}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <Badge variant="info">{section.badge}</Badge>
              <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}>{section.title}</h2>
            </div>
            <ul style={{ paddingLeft: "var(--space-4)", display: "grid", gap: "var(--space-2)" }}>
              {section.points.map((point) => (
                <li
                  key={point}
                  style={{ fontSize: "var(--text-sm)", color: "var(--color-gray-600)", lineHeight: 1.5 }}
                >
                  {point}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Contact section */}
      <section style={{ textAlign: "center", padding: "var(--space-12) 0", marginTop: "var(--space-8)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
          Interesse?
        </h2>
        <p style={{ color: "var(--color-gray-500)", marginBottom: "var(--space-4)" }}>
          De volledige broncode is beschikbaar op GitLab.
          Ik sta open voor vragen over de architectuur, code, of mijn aanpak.
        </p>
        <p style={{ fontWeight: 600, color: "var(--color-primary)" }}>
          Chiril Ojoga — flexforbelsimpel.chirilojoga.com
        </p>
      </section>
    </div>
  );
}
