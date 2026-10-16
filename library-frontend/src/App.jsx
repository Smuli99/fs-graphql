import { useState } from 'react'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'
import { useApolloClient, useQuery } from '@apollo/client/react'

import Authors from './components/Authors'
import NewBook from './components/NewBook'
import Login from './components/Login'
import FilterBooks from './components/FilterBooks'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(localStorage.getItem('library-user-token'));
  
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const client = useApolloClient();

  if (authorsResult.loading || booksResult.loading) return <div>loading...</div>;

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();

    if (page === 'add') setPage('authors');
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { !token && <button onClick={() => setPage('login')}>login</button> }
        { token && <button onClick={() => setPage('add')}>add book</button> }
        { token && <button onClick={() => setPage('recommendations')}>recommendations</button>}
        { token && <button onClick={onLogout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors} user={ token !== null }/>

      <FilterBooks show={page === 'books'} books={booksResult.data.allBooks} />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} setToken={setToken} setPage={setPage} />

      <Recommendations show={page === 'recommendations'} />

    </div>
  );
};

export default App;
