import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR } from '../queries'

const BirthyearForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeBirthyear ] = useMutation(EDIT_AUTHOR)

  const submit = (event) => {
    event.preventDefault()

    changeBirthyear({ variables: { name, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }
  
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select
            name='name'
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map(a => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <label>
          born
          <input type='' value={born} onChange={({ target }) => setBorn(target.value)} />
        </label>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm