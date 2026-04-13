// Plan listing page — /plans
//
// Same architecture pattern as the phone listing:
//   - Elasticsearch-powered search (fuzzy matching)
//   - Filter sidebar with faceted counts (provider, network, data range)
//   - All state in URL params → bookmarkable + shareable
//   - Loader runs server-side (SSR) → no loading spinner on first paint
//
// This page helps users browse all available SIM-only subscription plans
// from Dutch providers (KPN, Vodafone, T-Mobile, Tele2, Simpel).

import { useLoaderData, useSearchParams } from "react-router";
import type { Route } from "./+types/plans._index";
import { queryGraphQL } from "~/lib/graphql-client";
import { SEARCH_PLANS } from "~/graphql/queries/plans";
import SearchInput from "~/components/ui/SearchInput/SearchInput";
import PlanCard from "~/components/plans/PlanCard/PlanCard";
import { useState } from "react";
import { useDebounce } from "~/hooks/useDebounce";

// Type definitions matching the GraphQL response shape
interface PlanSearchData {
  searchPlans: {
    items: Array<{
      id: string;
      name: string;
      slug: string;
      monthly_cost_eur: number;
      data_gb: number | null;
      minutes: number | null;
      is_unlimited_data: boolean;
      is_unlimited_calls: boolean;
      network_type: string;
      contract_months: number;
      provider: { name: string; slug: string };
    }>;
    total: number;
    facets: {
      providers: Array<{ key: string; count: number }>;
      networkTypes: Array<{ key: string; count: number }>;
      dataRanges: Array<{ key: string; count: number }>;
    };
  };
}

// Loader — fetches plans from Elasticsearch via GraphQL before rendering.
// Reads all filter state from URL search params so the page is shareable.
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const providerSlugs = url.searchParams.get("provider")?.split(",").filter(Boolean) || undefined;
  const networkType = url.searchParams.get("network") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const data = await queryGraphQL<PlanSearchData>(SEARCH_PLANS, {
    query: query || undefined,
    filters: {
      ...(providerSlugs && { providerSlugs }),
      ...(networkType && { networkType }),
    },
    page,
    perPage: 12,
  });

  return { searchResult: data.searchPlans, query };
}

export default function PlansIndex() {
  const { searchResult, query: initialQuery } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialQuery);

  // Debounce — same pattern as phone search
  const debouncedSearch = useDebounce(searchValue);

  function handleSearch(value: string) {
    setSearchValue(value);
    setSearchParams((prev) => {
      if (value) {
        prev.set("q", value);
      } else {
        prev.delete("q");
      }
      prev.delete("page");
      return prev;
    });
  }

  // Toggle a provider filter on/off
  function handleProviderFilter(slug: string) {
    setSearchParams((prev) => {
      const current = prev.get("provider")?.split(",").filter(Boolean) || [];
      const updated = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];

      if (updated.length > 0) {
        prev.set("provider", updated.join(","));
      } else {
        prev.delete("provider");
      }
      prev.delete("page");
      return prev;
    });
  }

  // Toggle network type filter (4G / 5G)
  function handleNetworkFilter(type: string) {
    setSearchParams((prev) => {
      if (prev.get("network") === type) {
        prev.delete("network");
      } else {
        prev.set("network", type);
      }
      prev.delete("page");
      return prev;
    });
  }

  const activeProviders = searchParams.get("provider")?.split(",").filter(Boolean) || [];
  const activeNetwork = searchParams.get("network") || "";

  return (
    <div style={{ display: "flex", gap: "var(--space-8)" }}>
      {/* Filter sidebar — faceted navigation powered by Elasticsearch aggregations */}
      <aside style={{ width: "250px", flexShrink: 0 }}>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
          Filters
        </h2>

        {/* Provider filter with facet counts */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-gray-600)" }}>
            Provider
          </h3>
          {searchResult.facets.providers.map((bucket) => (
            <label
              key={bucket.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-1) 0",
                cursor: "pointer",
                fontSize: "var(--text-sm)",
              }}
            >
              <input
                type="checkbox"
                checked={activeProviders.includes(bucket.key)}
                onChange={() => handleProviderFilter(bucket.key)}
              />
              <span style={{ textTransform: "capitalize" }}>{bucket.key}</span>
              <span style={{ marginLeft: "auto", color: "var(--color-gray-400)", fontSize: "var(--text-xs)" }}>
                ({bucket.count})
              </span>
            </label>
          ))}
        </div>

        {/* Network type filter */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-gray-600)" }}>
            Netwerk
          </h3>
          {searchResult.facets.networkTypes.map((bucket) => (
            <label
              key={bucket.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-1) 0",
                cursor: "pointer",
                fontSize: "var(--text-sm)",
              }}
            >
              <input
                type="radio"
                name="network"
                checked={activeNetwork === bucket.key}
                onChange={() => handleNetworkFilter(bucket.key)}
              />
              <span>{bucket.key}</span>
              <span style={{ marginLeft: "auto", color: "var(--color-gray-400)", fontSize: "var(--text-xs)" }}>
                ({bucket.count})
              </span>
            </label>
          ))}
        </div>

        {/* Data range facets (read-only info) */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-gray-600)" }}>
            Data
          </h3>
          {searchResult.facets.dataRanges.map((bucket) => (
            <div
              key={bucket.key}
              style={{ fontSize: "var(--text-sm)", padding: "var(--space-1) 0", color: "var(--color-gray-600)" }}
            >
              {bucket.key.replace("-", " - ")} ({bucket.count})
            </div>
          ))}
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ flex: 1 }}>
        <SearchInput
          value={searchValue}
          onChange={handleSearch}
          placeholder="Zoek abonnementen... (bijv. 'onbeperkt 5G')"
        />

        <p style={{ margin: "var(--space-4) 0", color: "var(--color-gray-500)", fontSize: "var(--text-sm)" }}>
          {searchResult.total} abonnementen gevonden
        </p>

        {/* Plan grid — 2 columns for plans since they're wider than phone cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {searchResult.items.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Empty state */}
        {searchResult.items.length === 0 && (
          <div style={{ textAlign: "center", padding: "var(--space-16) 0", color: "var(--color-gray-500)" }}>
            <p style={{ fontSize: "var(--text-lg)" }}>Geen abonnementen gevonden</p>
            <p>Probeer een andere zoekterm of pas je filters aan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
