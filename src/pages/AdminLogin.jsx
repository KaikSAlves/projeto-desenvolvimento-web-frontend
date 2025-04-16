import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockUser = {
  username: 'admin',
  password: 'admin123',
};

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    // Mock de autenticação
    if (username === mockUser.username && password === mockUser.password) {
      navigate('/admin-dashboard');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-400 to-pink-400 relative">
      {/* Botão de voltar */}
      <button
        className="absolute left-4 bottom-4 flex items-center text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-lg text-sm transition-colors"
        onClick={() => navigate(-1)}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>
      <form
        onSubmit={handleLogin}
        className="bg-white/90 rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-red-600 font-display">Login do Administrador</h2>
        <div className="w-full mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Usuário</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all bg-white"
            placeholder="Digite o usuário"
            autoFocus
          />
        </div>
        <div className="w-full mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all bg-white"
            placeholder="Digite a senha"
          />
        </div>
        {error && <div className="w-full mb-4 text-red-600 text-center font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-lg font-bold text-lg shadow-md transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
} 