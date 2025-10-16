import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    posts(first: 18) {
      nodes {
        id
        title
        slug
        date
        excerpt
        commentCount
        categories {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

