import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql /* GraphQL */ `
  fragment AuthorDetails on Author {
    name
    born
    bookCount
    id
  }
`

const BOOK_DETAILS = gql /* GraphQL */ `
  fragment BookDetails on Book {
    title
    author {
      ...AuthorDetails
    }
    published
    genres
    id
  }

  ${AUTHOR_DETAILS}
`

export const ALL_AUTHORS = gql /* GraphQL */ `
  query getAuthors {
    allAuthors {
      ...AuthorDetails
    }
  }

  ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql /* GraphQL */ `
  query getBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const CREATE_BOOK = gql /* GraphQL */ `
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql /* GraphQL */ `
  mutation editAuthor($name: String! $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }

  ${AUTHOR_DETAILS}
`

export const LOGIN = gql /* GraphQL */ `
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const CURRENT_USER = gql /* GraphQL */ `
  query getUser {
    me {
      username
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql /* GraphQL */ `
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`