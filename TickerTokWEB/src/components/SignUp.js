import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: '#282c34',
            color: 'white',
            border: '1px solid #fff',
            padding: '0.5em 1em',
            fontSize: '1em',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          &#8592; Back
        </button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ margin: '0.5em', padding: '0.5em', fontSize: '1em' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ margin: '0.5em', padding: '0.5em', fontSize: '1em' }}
          />
          <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5em 1em', fontSize: '1.1em', borderRadius: '4px', marginTop: '1em' }}>Sign Up</button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </header>
    </div>
  );
};

export default SignUp;
