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

export const ALL_BOOKS = gql /* GraphQL */ `
  query getBooks {
    allBooks {
      title
      author
      published
      genres
      id
    }
  }
`