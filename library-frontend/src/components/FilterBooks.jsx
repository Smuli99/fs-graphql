import { useState } from 'react';
import Books from './Books';

const ALL = 'all genres';

const FilterBooks = ({ show, books }) => {
  const [filter, setFilter] = useState('all genres');
  
  if (!show) return null;

  const genres = [ ALL, ...new Set(books.flatMap(book => book.genres)) ];
  
  const booksToShow = filter === 'all genres'
    ? books
    : books.filter(book => book.genres.includes(filter));

  return (
    <div>
      <Books
        books={booksToShow}
        title='Books'
        genres={genres}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}

export default FilterBooks;