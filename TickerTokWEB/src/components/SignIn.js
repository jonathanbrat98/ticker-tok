import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/app');
    } catch (err) {
      setError('Google sign in failed: ' + err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Sign In</h2>
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
          <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5em 1em', fontSize: '1.1em', borderRadius: '4px', marginTop: '1em' }}>Sign In</button>
          <button
            onClick={handleGoogleSignIn}
            type="button"
            style={{
              marginTop: '2em',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              padding: '0.5em 1.5em',
              fontSize: '1.1em',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.93 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C-1.13 17.13-1.13 30.87 1.69 37.91l7.98-6.2z"/><path fill="#EA4335" d="M24 46c6.13 0 11.64-2.02 15.85-5.49l-7.19-5.6c-2.01 1.35-4.6 2.14-8.66 2.14-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Sign In with Google
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <div style={{ marginTop: '1em' }}>
          <span>Don't have an account? </span>
          <a href="/signup" className="App-link">Sign Up</a>
        </div>
      </header>
    </div>
  );
};

export default SignIn;
