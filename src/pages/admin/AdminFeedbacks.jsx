import { useState, useEffect } from 'react';
import { FaStar, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ax from 'axios';

export default function AdminFeedbacks() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtros, setFiltros] = useState({
    avaliacao: ''
  });

  useEffect(() => {
      async function carregarFeedbacks() {
      const response = await ax.get('http://localhost:8080/feedback');
      setFeedbacks(response.data);
      }
      carregarFeedbacks();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleDeletar = (id) => {
    ax.delete(`http://localhost:8080/feedback/${id}`)
      .then(() => {
        const feedbacksAtualizados = feedbacks.filter(f => f.id_feedback !== id);
        setFeedbacks(feedbacksAtualizados);
      }
      )
      .catch(error => {
        console.error('Erro ao deletar feedback:', error);
      });
  };

  // Filtra os feedbacks com base nos filtros selecionados
  const feedbacksFiltrados = feedbacks.filter(feedback => {
    const avaliacaoMatch = filtros.avaliacao === '' || feedback.nvl_avaliacao_feedback === parseInt(filtros.avaliacao);
    return avaliacaoMatch;
  });

  return (
    <div className="p-6">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
      >
        <FaArrowLeft />
        Voltar à Página Inicial
      </button>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 gap-4">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avaliação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feedbacksFiltrados.map((feedback) => (
              <tr key={feedback.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < feedback.nvl_avaliacao_feedback ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{feedback.descricao_feedback}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(feedback.data_feedback).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleDeletar(feedback.id_feedback)}
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