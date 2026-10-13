import { useState } from 'react';

const Book = ({ book }) => {
  return (
    <tr>
      <td>{book.title}</td>
      <td>{book.author.name}</td>
      <td>{book.published}</td>
    </tr>
  )
}

const Books = ({ show, books }) => {
  const [filter, setFilter] = useState('all genres');
  const genres = [ ...new Set(books.flatMap(book => book.genres)) ].concat('all genres');
  const booksToShow = filter === 'all genres'
    ? books
    : books.filter(book => book.genres.includes(filter));
  
  if (!show) return null

  return (
    <div>
      <h2>books</h2>

      {filter === 'all genres'
        ? <strong>all genres</strong>
        : <div>in genre <strong>{filter}</strong></div> 
      }

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </tbody>
      </table>

      {genres.map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      ))}
    </div>
  )
}

export default Books
