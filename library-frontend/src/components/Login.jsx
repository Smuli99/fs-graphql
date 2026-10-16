import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../queries';

const Login = ({ show, setToken, setPage, notify }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [ login ] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
    },
    onError: () => notify('login failed'), // testejä varten
  });
  
  if (!show) return null;

  const submit = (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
    setPage('authors');
    
    setUsername('');
    setPassword('secret');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          username
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </label>
        <label>
          password
          <input value={password} onChange={({ target }) => setPassword(target.value)} />
        </label>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default Login;