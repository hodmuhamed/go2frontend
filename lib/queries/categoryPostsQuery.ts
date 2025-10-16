import { gql } from "@apollo/client";

export const GET_CATEGORY_POSTS = gql`
  query GetCategoryPosts($slug: String!, $first: Int = 5) {
    posts(first: $first, where: { categoryName: $slug }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        commentCount
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;
