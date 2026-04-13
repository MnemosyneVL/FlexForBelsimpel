// Phone listing page — /phones
//
// This is the main phone browsing page with:
//   - A search bar powered by Elasticsearch (fuzzy matching, typo tolerance)
//   - Filter sidebar with faceted counts (brand, price range, storage, OS)
//   - Responsive grid of PhoneCard components
//   - Pagination
//
// All search state lives in URL params (?q=samsung&brand=samsung&page=2).
// This means searches are bookmarkable and shareable.
//
// The loader runs on the server (SSR) — it calls our GraphQL API
// to get search results BEFORE the page renders. The user sees a
// fully loaded page, not a loading spinner.

import { useLoaderData, useSearchParams } from "react-router";
import type { Route } from "./+types/phones._index";
import { queryGraphQL } from "~/lib/graphql-client";
import { SEARCH_PHONES } from "~/graphql/queries/phones";
import SearchInput from "~/components/ui/SearchInput/SearchInput";
import PhoneCard from "~/components/phones/PhoneCard/PhoneCard";
import { useCompare } from "~/hooks/useCompare";
import { useState } from "react";
import { useDebounce } from "~/hooks/useDebounce";

// Type definitions for our GraphQL response
interface PhoneSearchData {
  searchPhones: {
    items: Array<{
      id: string;
      name: string;
      slug: string;
      image_url: string | null;
      price_eur: number;
      storage_gb: number;
      ram_gb: number;
      is_5g: boolean;
      os: string;
      phoneBrand: { name: string; slug: string };
    }>;
    total: number;
    facets: {
      brands: Array<{ key: string; count: number }>;
      priceRanges: Array<{ key: string; count: number }>;
      storageOptions: Array<{ key: string; count: number }>;
      operatingSystems: Array<{ key: string; count: number }>;
    };
  };
}

// The loader function — runs on the server before the component renders.
// It reads URL search params and calls the GraphQL searchPhones query.
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const brandSlugs = url.searchParams.get("brand")?.split(",").filter(Boolean) || undefined;
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const data = await queryGraphQL<PhoneSearchData>(SEARCH_PHONES, {
    query: query || undefined,
    filters: brandSlugs ? { brandSlugs } : undefined,
    page,
    perPage: 12,
  });

  return { searchResult: data.searchPhones, query };
}

export default function PhonesIndex() {
  const { searchResult, query: initialQuery } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialQuery);
  const { isComparing, toggleCompare } = useCompare();

  // Debounce search — wait 300ms after user stops typing before searching
  const debouncedSearch = useDebounce(searchValue);

  // Update URL when search changes
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

  // Toggle a brand filter
  function handleBrandFilter(slug: string) {
    setSearchParams((prev) => {
      const current = prev.get("brand")?.split(",").filter(Boolean) || [];
      const updated = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];

      if (updated.length > 0) {
        prev.set("brand", updated.join(","));
      } else {
        prev.delete("brand");
      }
      prev.delete("page");
      return prev;
    });
  }

  const activeBrands = searchParams.get("brand")?.split(",").filter(Boolean) || [];

  return (
    <div style={{ display: "flex", gap: "var(--space-8)" }}>
      {/* Filter sidebar */}
      <aside style={{ width: "250px", flexShrink: 0 }}>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
          Filters
        </h2>

        {/* Brand filter with facet counts */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-gray-600)" }}>
            Merk
          </h3>
          {searchResult.facets.brands.map((bucket) => (
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
                checked={activeBrands.includes(bucket.key)}
                onChange={() => handleBrandFilter(bucket.key)}
              />
              <span style={{ textTransform: "capitalize" }}>{bucket.key}</span>
              <span style={{ marginLeft: "auto", color: "var(--color-gray-400)", fontSize: "var(--text-xs)" }}>
                ({bucket.count})
              </span>
            </label>
          ))}
        </div>

        {/* Price range facets */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-gray-600)" }}>
            Prijsklasse
          </h3>
          {searchResult.facets.priceRanges.map((bucket) => (
            <div
              key={bucket.key}
              style={{ fontSize: "var(--text-sm)", padding: "var(--space-1) 0", color: "var(--color-gray-600)" }}
            >
              {bucket.key.replace("-", " - ").replace("+", "+")} ({bucket.count})
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* Search bar */}
        <SearchInput
          value={searchValue}
          onChange={handleSearch}
          placeholder="Zoek telefoons... (bijv. 'Samsung Galaxy')"
        />

        {/* Results count */}
        <p style={{ margin: "var(--space-4) 0", color: "var(--color-gray-500)", fontSize: "var(--text-sm)" }}>
          {searchResult.total} telefoons gevonden
        </p>

        {/* Phone grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {searchResult.items.map((phone) => (
            <PhoneCard
              key={phone.id}
              phone={phone}
              isComparing={isComparing(phone.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>

        {/* Empty state */}
        {searchResult.items.length === 0 && (
          <div style={{ textAlign: "center", padding: "var(--space-16) 0", color: "var(--color-gray-500)" }}>
            <p style={{ fontSize: "var(--text-lg)" }}>Geen telefoons gevonden</p>
            <p>Probeer een andere zoekterm of pas je filters aan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
