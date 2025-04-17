import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const mockProdutos = [
  { id: 101, nome: 'Geladinho de Morango' },
  { id: 102, nome: 'Geladinho de Chocolate' },
  { id: 103, nome: 'Geladinho de Coco' },
  { id: 104, nome: 'Geladinho de Uva' },
  { id: 105, nome: 'Geladinho de Abacaxi' },
  { id: 201, nome: 'Picolé de Limão' },
  { id: 202, nome: 'Picolé de Maracujá' },
  { id: 203, nome: 'Picolé de Morango' },
  { id: 204, nome: 'Picolé de Chocolate' },
  { id: 205, nome: 'Picolé de Coco' },
  { id: 206, nome: 'Picolé de Uva' },
  { id: 207, nome: 'Picolé de Abacaxi' },
  { id: 208, nome: 'Picolé de Manga' },
  { id: 209, nome: 'Picolé de Graviola' },
  { id: 210, nome: 'Picolé de Acerola' },
  { id: 211, nome: 'Picolé de Cupuaçu' },
  { id: 212, nome: 'Picolé de Açaí' },
  { id: 213, nome: 'Picolé de Tangerina' },
  { id: 214, nome: 'Picolé de Goiaba' },
  { id: 215, nome: 'Picolé de Cajá' },
  { id: 216, nome: 'Picolé de Caju' },
  { id: 217, nome: 'Picolé de Pitanga' },
  { id: 218, nome: 'Picolé de Jabuticaba' },
  { id: 219, nome: 'Picolé de Tamarindo' },
  { id: 220, nome: 'Picolé de Carambola' }
];

const mockEstoques = [
  { id: 1, produtoId: 101, nomeProduto: 'Geladinho de Morango', quantidade: 50, minimo: 10, dataAtualizacao: '2024-03-20' },
  { id: 2, produtoId: 102, nomeProduto: 'Geladinho de Chocolate', quantidade: 30, minimo: 5, dataAtualizacao: '2024-03-19' },
];

export default function AdminEstoque() {
  const [estoques, setEstoques] = useState(mockEstoques);
  const [filtros, setFiltros] = useState({
    idEstoque: '',
    produtoId: '',
    data: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [estoqueEditando, setEstoqueEditando] = useState(null);
  const [formData, setFormData] = useState({
    produtoId: '',
    nomeProduto: '',
    quantidade: '',
    minimo: '',
    dataAtualizacao: ''
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'produtoId') {
      const produtoSelecionado = mockProdutos.find(p => p.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        produtoId: value,
        nomeProduto: produtoSelecionado ? produtoSelecionado.nome : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditar = (estoque) => {
    setEstoqueEditando(estoque);
    setFormData({
      produtoId: estoque.produtoId,
      nomeProduto: estoque.nomeProduto,
      quantidade: estoque.quantidade,
      minimo: estoque.minimo,
      dataAtualizacao: estoque.dataAtualizacao
    });
    setModalAberto(true);
  };

  const handleDeletar = (id) => {
    setEstoques(prev => prev.filter(e => e.id !== id));
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    
    // Validações
    if (parseInt(formData.quantidade) <= 0) {
      alert('A quantidade deve ser maior que zero');
      return;
    }

    if (parseInt(formData.minimo) <= 0) {
      alert('A quantidade mínima deve ser maior que zero');
      return;
    }

    if (parseInt(formData.quantidade) < parseInt(formData.minimo)) {
      alert('A quantidade não pode ser menor que a quantidade mínima');
      return;
    }

    const dataAtualizacao = new Date(formData.dataAtualizacao);
    const hoje = new Date();
    if (dataAtualizacao > hoje) {
      alert('A data de atualização não pode ser futura');
      return;
    }
    
    if (estoqueEditando) {
      setEstoques(prev => prev.map(e => 
        e.id === estoqueEditando.id 
          ? { ...e, ...formData, quantidade: parseInt(formData.quantidade), minimo: parseInt(formData.minimo) }
          : e
      ));
    } else {
      const novoEstoque = {
        id: estoques.length > 0 ? Math.max(...estoques.map(e => e.id)) + 1 : 1,
        ...formData,
        quantidade: parseInt(formData.quantidade),
        minimo: parseInt(formData.minimo)
      };
      setEstoques(prev => [...prev, novoEstoque]);
    }

    setModalAberto(false);
    setEstoqueEditando(null);
    setFormData({
      produtoId: '',
      nomeProduto: '',
      quantidade: '',
      minimo: '',
      dataAtualizacao: ''
    });
  };

  const handleCancelar = () => {
    setModalAberto(false);
    setEstoqueEditando(null);
    setFormData({
      produtoId: '',
      nomeProduto: '',
      quantidade: '',
      minimo: '',
      dataAtualizacao: ''
    });
  };

  return (
    <div className="p-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Estoque</label>
            <input
              type="text"
              name="idEstoque"
              value={filtros.idEstoque}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Digite o ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <select
              name="produtoId"
              value={filtros.produtoId}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Todos</option>
              {mockProdutos.map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={filtros.data}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Botão Adicionar */}
      <button
        onClick={() => {
          setEstoqueEditando(null);
          setFormData({
            produtoId: '',
            nomeProduto: '',
            quantidade: '',
            minimo: '',
            dataAtualizacao: ''
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Atualização</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {estoques.map((estoque) => (
              <tr key={estoque.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estoque.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estoque.nomeProduto}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estoque.quantidade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estoque.minimo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(estoque.dataAtualizacao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleEditar(estoque)}
                    className="text-gray-600 hover:text-gray-900 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeletar(estoque.id)}
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
              {estoqueEditando ? 'Editar Estoque' : 'Adicionar Estoque'}
            </h2>
            <form onSubmit={handleSalvar}>
              {estoqueEditando && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <input
                    type="text"
                    value={estoqueEditando.id}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Produto</label>
                  <select
                    name="produtoId"
                    value={formData.produtoId}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {mockProdutos.map(produto => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade Mínima</label>
                  <input
                    type="number"
                    name="minimo"
                    value={formData.minimo}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Atualização</label>
                  <input
                    type="date"
                    name="dataAtualizacao"
                    value={formData.dataAtualizacao}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg"
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
} 