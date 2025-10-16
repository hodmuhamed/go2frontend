import { gql } from "@apollo/client";

export const GET_CATEGORY_ARCHIVE = gql`
  query GetCategoryArchive($slug: String!, $first: Int = 9, $after: String) {
    category(id: $slug, idType: SLUG) {
      id
      name
      description
    }
    posts(first: $first, after: $after, where: { categoryName: $slug }) {
      pageInfo {
        endCursor
        hasNextPage
      }
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
