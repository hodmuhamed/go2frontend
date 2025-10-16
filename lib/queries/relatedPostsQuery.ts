import { gql } from "@apollo/client";

export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($slug: String!, $exclude: [ID!], $first: Int = 3) {
    posts(first: $first, where: { categoryName: $slug, notIn: $exclude }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;
