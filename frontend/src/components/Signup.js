import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = () => {
  const [form, setForm] = useState({ Name: '', Email: '', Password: '' });
  const [message, setMessage] = useState(null); // For success or error messages
  const [isLoading, setIsLoading] = useState(false); // For a loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null); // Clear previous messages
    try {
      console.log('Submitting form:', form);
      const response = await fetch('http://localhost:5000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      setMessage({ type: 'success', text: 'Signup successful! Redirecting to login...' });
      console.log('Signup response:', data);

      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate('/user/login'); // Redirect to the login page
      }, 2000); // Optional: Add a delay of 2 seconds
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage({ type: 'error', text: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Signup</h1>
      {message && (
        <div
          style={{
            padding: '10px',
            marginBottom: '15px',
            color: message.type === 'success' ? 'green' : 'red',
            border: `1px solid ${message.type === 'success' ? 'green' : 'red'}`,
          }}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            placeholder="Enter your name"
            value={form.Name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            placeholder="Enter your Email"
            value={form.Email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            placeholder="Enter your Password"
            value={form.Password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Signup;