import BirthyearForm from "./BirthyearForm"

const Author = ({ author }) => {
  return (
    <tr>
      <td>{author.name}</td>
      <td>{author.born}</td>
      <td>{author.bookCount}</td>
    </tr>
  )
}

const Authors = ({ show, authors, user }) => {
  if (!show) return null

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((author) => (
            <Author key={author.id} author={author} />
          ))}
        </tbody>
      </table>

      {user && <BirthyearForm authors={authors} />}
    </div>
  )
}

export default Authors
