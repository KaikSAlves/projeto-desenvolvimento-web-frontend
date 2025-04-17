import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const mockProdutos = [
  { id: 101, tipo: 'Geladinho', sabor: 'Morango', descricao: 'Geladinho sabor morango', valor: 2.50 },
  { id: 102, tipo: 'Geladinho', sabor: 'Chocolate', descricao: 'Geladinho sabor chocolate', valor: 2.50 },
  { id: 201, tipo: 'Picolé', sabor: 'Limão', descricao: 'Picolé sabor limão', valor: 3.00 },
];

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState(mockProdutos);
  const [filtros, setFiltros] = useState({
    idProduto: '',
    sabor: '',
    tipo: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formData, setFormData] = useState({
    tipo: '',
    sabor: '',
    descricao: '',
    valor: ''
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setFormData({
      tipo: produto.tipo,
      sabor: produto.sabor,
      descricao: produto.descricao,
      valor: produto.valor
    });
    setModalAberto(true);
  };

  const handleDeletar = (id) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    
    // Validações
    if (parseFloat(formData.valor) <= 0) {
      alert('O valor deve ser maior que zero');
      return;
    }
    
    if (produtoEditando) {
      setProdutos(prev => prev.map(p => 
        p.id === produtoEditando.id 
          ? { ...p, ...formData, valor: parseFloat(formData.valor) }
          : p
      ));
    } else {
      const novoProduto = {
        id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 101,
        ...formData,
        valor: parseFloat(formData.valor)
      };
      setProdutos(prev => [...prev, novoProduto]);
    }

    setModalAberto(false);
    setProdutoEditando(null);
    setFormData({
      tipo: '',
      sabor: '',
      descricao: '',
      valor: ''
    });
  };

  const handleCancelar = () => {
    setModalAberto(false);
    setProdutoEditando(null);
    setFormData({
      tipo: '',
      sabor: '',
      descricao: '',
      valor: ''
    });
  };

  return (
    <div className="p-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Produto</label>
            <input
              type="text"
              name="idProduto"
              value={filtros.idProduto}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Digite o ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sabor</label>
            <input
              type="text"
              name="sabor"
              value={filtros.sabor}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Digite o sabor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Todos</option>
              <option value="Geladinho">Geladinho</option>
              <option value="Picolé">Picolé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão Adicionar */}
      <button
        onClick={() => {
          setProdutoEditando(null);
          setFormData({
            tipo: '',
            sabor: '',
            descricao: '',
            valor: ''
          });
          setModalAberto(true);
        }}
        className="mb-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
      >
        <FaPlus />
        Adicionar
      </button>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.sabor}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{produto.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {produto.valor.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleEditar(produto)}
                    className="text-gray-600 hover:text-gray-900 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeletar(produto.id)}
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

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {produtoEditando ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>
            <form onSubmit={handleSalvar}>
              {produtoEditando && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <input
                    type="text"
                    value={produtoEditando.id}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Geladinho">Geladinho</option>
                    <option value="Picolé">Picolé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sabor</label>
                  <input
                    type="text"
                    name="sabor"
                    value={formData.sabor}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor</label>
                  <input
                    type="number"
                    name="valor"
                    step="0.01"
                    value={formData.valor}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  {produtoEditando ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 