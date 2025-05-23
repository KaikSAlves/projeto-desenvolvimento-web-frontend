import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ax from 'axios';
import Swal from 'sweetalert2';

export default function AdminProdutos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [filtros, setFiltros] = useState({
    id: '',
    sabor: '',
    tipo: ''
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formData, setFormData] = useState({
    tipo_produto: '',
    sabor_produto: '',
    desc_produto: '',
    valor_produto: ''
  });

  useEffect(() => {
    async function carregarProdutos() {
      const response = await ax.get('http://localhost:8080/produto');
      setProdutos(response.data);
    }
    carregarProdutos();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipo') {
      setFormData(prev => ({
        ...prev,
        tipo_produto: value,
        sabor_produto: '' // Limpa o sabor quando o tipo muda
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setFormData({
      tipo_produto: produto.tipo_produto,
      sabor_produto: produto.sabor_produto,
      desc_produto: produto.desc_produto,
      valor_produto: produto.valor_produto
    });
    setModalAberto(true);
  };

  const handleDeletar = async (id) => {
    try {
      await ax.delete(`http://localhost:8080/produto/${id}`);
      setProdutos(prev => prev.filter(p => p.id_produto !== id));
      Swal.fire({
        title: 'Sucesso!',
        text: `O Produto ${id} foi deletado com sucesso!`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (e) {
      console.error('Erro ao deletar o produto:', e);

      Swal.fire({
        title: 'Erro!',
        text: 'Verifique se ele está vinculado a um estoque.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    // Validações
    if (parseFloat(formData.valor_produto) <= 0) {
      alert('O valor deve ser maior que zero');
      return;
    }

    if (produtoEditando) {
      const produtoAtualizado = {
        ...produtoEditando,
        ...formData,
        valor_produto: parseFloat(formData.valor_produto)
      };
      await ax.put(`http://localhost:8080/produto/${produtoEditando.id_produto}`, produtoAtualizado);

      setProdutos(prev => prev.map(p =>
        p.id_produto === produtoEditando.id_produto
          ? { ...p, ...formData, valor_produto: parseFloat(formData.valor_produto) }
          : p
      ));

      Swal.fire({
        title: 'Sucesso!',
        text: `O Produto ${produtoEditando.id_produto} foi editado com sucesso!`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } else {
      const novoProduto = {
        id_produto: '',
        ...formData,
        valor_produto: parseFloat(formData.valor_produto)
      };

      const response = await ax.post('http://localhost:8080/produto', novoProduto);
      novoProduto.id_produto = response.data.id;
      setProdutos(prev => [...prev, novoProduto]);
      Swal.fire({
        title: 'Sucesso!',
        text: `O Produto ${novoProduto.id_produto} criado!`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    }

    setModalAberto(false);
    setProdutoEditando(null);
    setFormData({
      tipo_produto: '',
      sabor_produto: '',
      desc_produto: '',
      valor_produto: ''
    });
  };

  const handleCancelar = () => {
    setModalAberto(false);
    setProdutoEditando(null);
    setFormData({
      tipo_produto: '',
      sabor_produto: '',
      desc_produto: '',
      valor_produto: ''
    });
  };


  const produtosFiltrados = produtos.filter(produtos => {
    // Filtra os produtos com base nos filtros selecionados
    const saborMatch = filtros.sabor === '' || produtos.sabor_produto.toLowerCase().includes(filtros.sabor.toLowerCase());
    const tipoMatch = filtros.tipo === '' || produtos.tipo_produto === filtros.tipo;
    const idMatch = filtros.id === '' || parseInt(filtros.id) === produtos.id_produto;
    const avaliacaoMatch = idMatch && saborMatch && tipoMatch;

    return avaliacaoMatch;
  });

  return (
    <div className="p-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Produto</label>
            <input
              type="text"
              name="id"
              value={filtros.id}
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
            tipo_produto: '',
            sabor_produto: '',
            desc_produto: '',
            valor_produto: ''
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
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id_produto}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.id_produto}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.tipo_produto}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.sabor_produto}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{produto.desc_produto}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {produto.valor_produto.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleEditar(produto)}
                    className="text-gray-600 hover:text-gray-900 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeletar(produto.id_produto)}
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
                    value={produtoEditando.id_produto}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    name="tipo_produto"
                    value={formData.tipo_produto}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  >
                    <option value="">Selecione um tipo</option>
                    <option value="Geladinho">Geladinho</option>
                    <option value="Picolé">Picolé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sabor</label>
                  <input
                    name="sabor_produto"
                    value={formData.sabor_produto}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  >
                  </input>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    name="desc_produto"
                    value={formData.desc_produto}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor</label>
                  <input
                    type="number"
                    name="valor_produto"
                    value={formData.valor_produto}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
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