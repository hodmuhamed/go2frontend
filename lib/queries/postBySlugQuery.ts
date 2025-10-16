import { gql } from "@apollo/client";

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
      commentCount
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;
