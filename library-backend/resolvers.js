const { GraphQLError } = require('graphql/error');
const Author = require('./model/author');
const Book = require('./model/book');

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: authors[0],
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: authors[0],
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: authors[1],
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: authors[2],
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: authors[4],
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: authors[2],
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: authors[3],
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

const createAuthor = async (args) => {
  const authorExists = await findAuthorByName(args.name);
  
  if (authorExists) {
    throw new GraphQLError(`Name must be unique: ${args.name}`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: args.name,
      }
    });
  }
  
  const author = new Author({ ...args });
  await author.save();
  return author;
};

// Find if author already exists by name (case insensitive)
const findAuthorByName = async (name) =>
  Author.findOne({ name }).collation({ locale: 'en', strength: 2 });

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      // const byAuthor = (book) =>
      //   book.author.toLowerCase() === args.author.toLowerCase();

      // const byGenre = (book) =>
      //   book.genres.some(genre => genre.toLowerCase() === args.genre.toLowerCase());

      // return books.filter(
      //   (book) =>
      //     (!args.author || byAuthor(book)) &&
      //     (!args.genre || byGenre(book))
      // );
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (root) =>
      books.filter(book => book.author.toLowerCase() === root.name.toLowerCase()).length,
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await findAuthorByName(args.author);
      
      if (!author) {
        author = await createAuthor({ name: args.author });
      }

      const book = new Book({ ...args, author: author._id });
      await book.save();

      return book.populate('author');
    },
    addAuthor: (root, args) => createAuthor(args),
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name.toLowerCase() === args.name.toLowerCase());
      if (!author) return null;

      const updatedAuthor = { ...author, born: args.setBornTo };
      authors = authors.map(a => a.id === updatedAuthor.id ? updatedAuthor : a);
      return updatedAuthor;
    }
  }
}

module.exports = resolvers;