const Book = ({ book }) => {
  return (
    <tr>
      <td>{book.title}</td>
      <td>{book.author.name}</td>
      <td>{book.published}</td>
    </tr>
  );
};

const Books = ({ books, title, genres, filter, setFilter }) => {
  const noBooks = books.length < 1; 

  return (
    <div>
      <h2>{title}</h2>

      {genres && filter === 'all genres'
        ? <strong>all genres</strong>
        : <div>in genre <strong>{filter}</strong></div> 
      }

      {!genres && 'books in your favorite genre'} {/* testejä varten */}

      {noBooks && <div style={{ marginTop: 10 }}>No books</div>}
      {!noBooks && (
        <div>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {books.map((book) => (
                <Book key={book.id} book={book} />
              ))}
            </tbody>
          </table>
    
          {genres && genres.map(genre => (
            <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Books
