import { useQuery } from '@apollo/client/react';
import { CURRENT_USER } from '../queries';

import Books from './Books';

const Recommendations = ({ show, books }) => {
  const userResult = useQuery(CURRENT_USER, { skip: !show });
  
  if (!show) return null;
  if (userResult.loading) return <div>loading...</div>;

  const favoriteGenre = userResult.data.me.favoriteGenre;

  return (
    <div>
      <p>Hei</p>
      <Books
        books={books.filter(books => books.genres.includes(favoriteGenre))}
        title='recommendations'
        filter={favoriteGenre}
      />
    </div>
  );
};

export default Recommendations;