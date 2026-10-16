import { useState } from 'react';
import { ALL_BOOKS } from '../queries';
import { useQuery } from '@apollo/client/react';
import Books from './Books';

const ALL = 'all genres';

const FilterBooks = ({ show, books }) => {
  const [filter, setFilter] = useState('all genres');
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: filter === 'all genres' ? undefined : filter},
    skip: !show
  });
  
  if (!show) return null;
  if (booksResult.loading && !booksResult.data) return <div>loading...</div>;

  const genres = [ ALL, ...new Set(books.flatMap(book => book.genres)) ];

  return (
    <div>
      <Books
        books={booksResult.data.allBooks}
        title='Books'
        genres={genres}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
};

export default FilterBooks;