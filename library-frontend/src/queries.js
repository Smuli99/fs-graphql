import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql /* GraphQL */ `
  query getAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`