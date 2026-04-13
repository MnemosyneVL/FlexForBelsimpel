// GraphQL mutations for wishlist operations.
// Mutations are "write" operations — they change data on the server.

export const ADD_TO_WISHLIST = `
  mutation AddToWishlist($input: WishlistInput!) {
    addToWishlist(input: $input) {
      id
      notes
      phone { id name slug price_eur phoneBrand { name } }
      plan { id name slug monthly_cost_eur provider { name } }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = `
  mutation RemoveFromWishlist($id: ID!) {
    removeFromWishlist(id: $id)
  }
`;

export const CREATE_PRICE_ALERT = `
  mutation CreatePriceAlert($input: PriceAlertInput!) {
    createPriceAlert(input: $input) {
      id
      target_price_eur
      is_triggered
      phone { name }
    }
  }
`;

export const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id name email }
    }
  }
`;

export const REGISTER = `
  mutation Register($name: String!, $email: String!, $password: String!, $password_confirmation: String!) {
    register(name: $name, email: $email, password: $password, password_confirmation: $password_confirmation) {
      token
      user { id name email }
    }
  }
`;
