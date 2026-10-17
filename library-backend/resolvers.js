const { GraphQLError } = require('graphql/error');
const { PubSub } = require('graphql-subscriptions');

const jwt = require('jsonwebtoken');

const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const pubsub = new PubSub();

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

const findUserByName = async (username) =>
  User.findOne({ username }).collation({ locale: 'en', strength: 2 });

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
    allAuthors: async () => {
      console.log('Author.find');
      return Author.find({});
    },
    me: (root, args, context) => context.currentUser, 
  },
  Author: {
    bookCount: (root) => {
      console.log('Book.count');
      // return Book.collection.countDocuments({ author: root._id })
      return root.books.length;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      let author = await findAuthorByName(args.author);
      
      if (!author) {
        author = await createAuthor({ name: args.author });
      }

      const book = new Book({ ...args, author: author._id });
      
      try {
        await book.save();
        author.books = author.books.concat(book._id);
        await author.save();
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          }
        });
      }

      await book.populate('author');
      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },

    addAuthor: (root, args) => createAuthor(args),

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const author = await findAuthorByName(args.name);
      if (!author) return null;

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
    },

    createUser: async (root, args) => {
      const userExists = await findUserByName(args.username);

      if (userExists) {
        throw new GraphQLError(`name must be unique: ${args.username}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
          }
        });
      }

      const user = new User({ ...args });

      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError(`Failed to create user: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        });
      }

      return user;
    },

    login: async (root, args) => {
      const user = await findUserByName(args.username);

      if ( !user || args.password != 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode');
      }

      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});

      return true;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers;