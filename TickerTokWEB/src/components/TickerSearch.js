import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const TickerSearch = () => {
  const navigate = useNavigate();
  const [ticker, setTicker] = useState('');
  const [openingPrice, setOpeningPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/signin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOpeningPrice(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You must be signed in.');
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      const response = await fetch(
        `http://localhost:5023/stock/opening-price?ticker=${encodeURIComponent(ticker)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          },
        }
      );
      if (!response.ok) {
        const text = await response.text();
        if (
          text.includes('Invalid ticker symbol') ||
          text.includes('Opening price not found')
        ) {
          setError('Please verify that the ticker you have entered is a valid one.');
        } else {
          setError(text || 'Failed to fetch opening price.');
        }
        setLoading(false);
        return;
      }
      const data = await response.json();
      setOpeningPrice(data.openingPrice);
    } catch (err) {
      setError('Error fetching opening price.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{ position: 'relative' }}>
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.5em 1em',
            fontSize: '1em',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 1,
          }}
        >
          Log Out
        </button>
        <h2>Stock Ticker</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          <input
            type="text"
            placeholder="Enter stock ticker..."
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            style={{ fontSize: '1.2em', padding: '0.5em' }}
            maxLength={8}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.5em 1em',
              fontSize: '1.2em',
              borderRadius: '4px',
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        {openingPrice !== null && (
          <div style={{ marginTop: '1em', fontSize: '1.2em' }}>
            Opening Price: <strong>${openingPrice}</strong>
          </div>
        )}
        {error && (
          <div className="error-message" style={{ marginTop: '1em' }}>
            {error}
          </div>
        )}
      </header>
    </div>
  );
};

export default TickerSearch; 