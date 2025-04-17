import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Dados mockados para exemplo
const mockProdutos = [
  { id: 1, nome: 'Geladinho de Morango', categoria: 'Geladinho', preco: 2.50, status: 'Ativo' },
  { id: 2, nome: 'Geladinho de Chocolate', categoria: 'Geladinho', preco: 2.50, status: 'Ativo' },
  { id: 3, nome: 'Picolé de Limão', categoria: 'Picolé', preco: 3.00, status: 'Ativo' },
];

const AdminProduto = () => {
  const [produtos, setProdutos] = useState(mockProdutos);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    preco: '',
    status: 'Ativo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar no backend
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Controle de Produtos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Adicionar
        </button>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {produto.preco.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    produto.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {produto.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-primary hover:text-secondary mr-2">
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Adicionar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Adicionar Produto</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Geladinho">Geladinho</option>
                  <option value="Picolé">Picolé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-secondary rounded-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduto; 