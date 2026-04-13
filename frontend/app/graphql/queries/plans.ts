// GraphQL queries for plans — phone subscription packages from Dutch providers.

export const SEARCH_PLANS = `
  query SearchPlans($query: String, $filters: PlanSearchFilters, $page: Int, $perPage: Int) {
    searchPlans(query: $query, filters: $filters, page: $page, perPage: $perPage) {
      items {
        id
        name
        slug
        monthly_cost_eur
        data_gb
        minutes
        is_unlimited_data
        is_unlimited_calls
        network_type
        contract_months
        provider {
          name
          slug
        }
      }
      total
      facets {
        providers { key count }
        networkTypes { key count }
        dataRanges { key count }
      }
    }
  }
`;

export const GET_PLAN = `
  query GetPlan($slug: String!) {
    plan(slug: $slug) {
      id
      name
      slug
      monthly_cost_eur
      data_gb
      minutes
      sms
      is_unlimited_data
      is_unlimited_calls
      network_type
      contract_months
      provider {
        name
        slug
        website_url
      }
      phonePlans {
        id
        monthly_cost_eur
        upfront_cost_eur
        total_cost_eur
        phone {
          id
          name
          slug
          price_eur
          image_url
          phoneBrand { name }
        }
      }
    }
  }
`;

export const GET_PROVIDERS = `
  query GetProviders {
    providers {
      id
      name
      slug
    }
  }
`;
