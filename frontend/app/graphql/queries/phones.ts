// GraphQL queries for phones.
//
// These are the "questions" the frontend asks the backend.
// Each query string is sent to the /graphql endpoint, and Laravel's
// Lighthouse processes it and returns the requested data.

// Search phones with Elasticsearch — used on the /phones page
export const SEARCH_PHONES = `
  query SearchPhones($query: String, $filters: PhoneSearchFilters, $page: Int, $perPage: Int) {
    searchPhones(query: $query, filters: $filters, page: $page, perPage: $perPage) {
      items {
        id
        name
        slug
        image_url
        price_eur
        storage_gb
        ram_gb
        is_5g
        os
        phoneBrand {
          name
          slug
        }
      }
      total
      facets {
        brands { key count }
        priceRanges { key count }
        storageOptions { key count }
        operatingSystems { key count }
      }
    }
  }
`;

// Get a single phone with all details — used on /phones/:phoneId
export const GET_PHONE = `
  query GetPhone($slug: String!) {
    phone(slug: $slug) {
      id
      name
      slug
      image_url
      price_eur
      release_year
      screen_size
      storage_gb
      ram_gb
      battery_mah
      camera_mp
      os
      color
      is_5g
      phoneBrand {
        name
        slug
      }
      phonePlans {
        id
        monthly_cost_eur
        upfront_cost_eur
        total_cost_eur
        plan {
          name
          slug
          data_gb
          is_unlimited_data
          network_type
          contract_months
          provider {
            name
            slug
          }
        }
      }
    }
  }
`;

// Compare multiple phones side by side
export const COMPARE_PHONES = `
  query ComparePhones($ids: [ID!]!) {
    comparePhones(ids: $ids) {
      id
      name
      slug
      image_url
      price_eur
      screen_size
      storage_gb
      ram_gb
      battery_mah
      camera_mp
      os
      is_5g
      phoneBrand {
        name
      }
    }
  }
`;

// Get similar phone recommendations
export const GET_RECOMMENDATIONS = `
  query PhoneRecommendations($phoneId: ID!, $limit: Int) {
    phoneRecommendations(phoneId: $phoneId, limit: $limit) {
      id
      name
      slug
      price_eur
      image_url
      phoneBrand {
        name
      }
    }
  }
`;

// Get all brands for filter sidebar
export const GET_BRANDS = `
  query GetBrands {
    phoneBrands {
      id
      name
      slug
    }
  }
`;

// Featured phones for the landing page
export const GET_FEATURED_PHONES = `
  query FeaturedPhones {
    phones(first: 3, orderBy: [{ column: CREATED_AT, order: DESC }]) {
      data {
        id
        name
        slug
        price_eur
        image_url
        is_5g
        phoneBrand {
          name
        }
      }
    }
  }
`;
