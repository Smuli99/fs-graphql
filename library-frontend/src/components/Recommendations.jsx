import { useQuery } from '@apollo/client/react';
import { CURRENT_USER, ALL_BOOKS } from '../queries';

import Books from './Books';

const Recommendations = ({ show }) => {
  const userResult = useQuery(CURRENT_USER, { skip: !show });
  const favoriteGenre = userResult.data?.me?.favoriteGenre;
  
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !show,
    fetchPolicy: 'cache-and-network',
  });
  
  if (!show) return null;
  if (userResult.loading || booksResult.loading) return <div>loading...</div>;

  return (
    <div>
      <Books
        books={booksResult.data.allBooks}
        title='recommendations'
        filter={favoriteGenre}
      />
    </div>
  );
};

export default Recommendations;