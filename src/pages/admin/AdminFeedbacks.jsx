import { useState } from 'react';
import { FaStar, FaTrash } from 'react-icons/fa';

const mockFeedbacks = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    avaliacao: 5,
    comentario: 'Os geladinhos são deliciosos!',
    data: '2024-03-20'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    avaliacao: 4,
    comentario: 'Gostei muito, mas poderia ter mais variedade de sabores.',
    data: '2024-03-19'
  }
];

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
  const [filtros, setFiltros] = useState({
    nome: '',
    email: '',
    avaliacao: ''
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleDeletar = (id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="p-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={filtros.nome}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Digite o nome"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={filtros.email}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Digite o email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação</label>
            <select
              name="avaliacao"
              value={filtros.avaliacao}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Todas</option>
              <option value="5">5 estrelas</option>
              <option value="4">4 estrelas</option>
              <option value="3">3 estrelas</option>
              <option value="2">2 estrelas</option>
              <option value="1">1 estrela</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avaliação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < feedback.avaliacao ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{feedback.comentario}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(feedback.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleDeletar(feedback.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 