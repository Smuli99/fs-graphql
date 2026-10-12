const { GraphQLError } = require('graphql/error');
const Author = require('./model/author');
const Book = require('./model/book');

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
  
  try {
    await author.save();
  } catch (error) {
    throw new GraphQLError(`Failed to save author: ${error.message}`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: args.name,
        error
      }
    });
  }

  return author;
};

// Find if author already exists by name (case insensitive)
const findAuthorByName = async (name) =>
  Author.findOne({ name }).collation({ locale: 'en', strength: 2 });

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await findAuthorByName(args.author);
        if (!author) return [];
        filter.author = author._id;
      }

      if (args.genre) filter.genres = args.genre;

      return Book.find(filter).populate('author');
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (root) => Book.collection.countDocuments({ author: root._id }),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await findAuthorByName(args.author);
      
      if (!author) {
        author = await createAuthor({ name: args.author });
      }

      const book = new Book({ ...args, author: author._id });
      
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          }
        });
      }

      return book.populate('author');
    },
    addAuthor: (root, args) => createAuthor(args),
    editAuthor: async (root, args) => {
      const author = await findAuthorByName(args.name);
      
      if (!author) {
        throw new GraphQLError(`Author not found: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        });
      };

      author.born = args.setBornTo;
      
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError(`Editing author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error,
          }
        });
      }

      return author;
    }
  },
}

module.exports = resolvers;