import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        login,
        password,
      });
      // Sauvegarde du token d'authentification
      localStorage.setItem('authToken', response.data.token);
      history.push('/dashboard'); // Redirection vers la page du tableau de bord
    } catch (err) {
      setError('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Se connecter</h2>
      <div className="input-group">
        <label htmlFor="login">Login :</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Chargement...' : 'Se connecter'}
      </button>
    </div>
  );
};

export default Login;
