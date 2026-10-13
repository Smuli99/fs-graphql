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
      author {
        name
        born
        bookCount
        id
      }
      published
      genres
      id
    }
  }
`

export const CREATE_BOOK = gql /* GraphQL */ `
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name
        born
        bookCount
        id
      }
      published
      genres
      id
    }
  }
`

export const EDIT_AUTHOR = gql /* GraphQL */ `
  mutation editAuthor($name: String! $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
      id
    }
  }
`

export const LOGIN = gql /* GraphQL */ `
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`