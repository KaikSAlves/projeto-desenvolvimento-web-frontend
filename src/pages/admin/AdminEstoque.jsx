import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaShoppingCart } from 'react-icons/fa';
import ax from 'axios';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

export default function AdminEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [estoques, setEstoques] = useState([]);
  const [filtros, setFiltros] = useState({
    idEstoque: '',
    produtoId: '',
    data: ''
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [estoqueEditando, setEstoqueEditando] = useState(null);
  const [estoqueVendendo, setEstoqueVendendo] = useState(null);
  const [formData, setFormData] = useState({
    id_estoque: '',
    id_produto: '',
    qtd_disponivel: '',
    qtd_min: '',
    data_atualizacao: ''
  });
  const [formVenda, setFormVenda] = useState({
    quantidade: '',
    valor_total: 0
  });

  // Atualiza o localStorage sempre que os estoques mudarem
  useEffect(() => {
    async function carregarEstoques() {
      try {
        const response = await ax.get('http://localhost:8080/estoque');
        const produtosResponse = await ax.get('http://localhost:8080/produto');

        if (response.data && produtosResponse.data) {
          setEstoques(response.data);
          setProdutos(produtosResponse.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível carregar os dados. Por favor, tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    }
    carregarEstoques();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'produtoId') {
      const produtoSelecionado = produtos.find(p => p.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        id_estoque: value,
        id_produto: produtoSelecionado ? produtoSelecionado.id_produto : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditar = (estoque) => {
    setEstoqueEditando(estoque);
    setFormData({
      id_estoque: estoque.id_estoque,
      id_produto: estoque.id_produto,
      qtd_disponivel: estoque.qtd_disponivel,
      qtd_min: estoque.qtd_min,
      data_atualizacao: new Date(estoque.data_atualizacao).toISOString().slice(0, 10)
    });
    setModalAberto(true);
  };

  const handleDeletar = async (id) => {
    await ax.delete(`http://localhost:8080/estoque/${id}`);
    setEstoques(prev => prev.filter(e => e.id_estoque !== id));

    Swal.fire({
      title: 'Sucesso!',
      text: `O Estoque ${id} foi deletado com sucesso!`,
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    // Validações
    if (parseInt(formData.qtd_disponivel) <= 0) {
      alert('A quantidade deve ser maior que zero');
      return;
    }

    if (parseInt(formData.qtd_min) <= 0) {
      alert('A quantidade mínima deve ser maior que zero');
      return;
    }

    if (parseInt(formData.qtd_disponivel) < parseInt(formData.qtd_min)) {
      alert('A quantidade não pode ser menor que a quantidade mínima');
      return;
    }

    const dataAtualizacao = new Date(formData.data_atualizacao);
    const hoje = new Date();
    const data_atualizacao = dayjs(formData.data_atualizacao).format("YYYY-MM-DD");

    if (dataAtualizacao > hoje) {
      alert('A data de atualização não pode ser futura');
      return;
    }

    if (estoqueEditando) {
      const estoqueAtualizado = {
        ...estoqueEditando,
        ...formData,
        data_atualizacao
      };

      await ax.put(`http://localhost:8080/estoque/${estoqueEditando.id_estoque}`, estoqueAtualizado);

      setEstoques(prev => prev.map(e =>
        e.id_estoque === estoqueEditando.id_estoque ? { ...formData, id_estoque: estoqueEditando.id_estoque } : e
      ));

      Swal.fire({
        title: 'Sucesso!',
        text: `O Estoque ${estoqueEditando.id_estoque} foi editado com sucesso!`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } else {
      const novoEstoque = {
        id_estoque: '',
        data_atualizacao,
        ...formData,
      };
      const response = await ax.post('http://localhost:8080/estoque', novoEstoque);
      novoEstoque.id_estoque = response.data.id;
      setEstoques(prev => [...prev, { ...formData, id_estoque: novoEstoque.id_estoque }]);
      Swal.fire({
        title: 'Sucesso!',
        text: `O Estoque ${novoEstoque.id_estoque} criado!`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    }

    setModalAberto(false);
    setEstoqueEditando(null);
    setFormData({
      id_estoque: '',
      id_produto: '',
      qtd_disponivel: '',
      qtd_min: '',
      data_atualizacao: ''
    });
  };

  const handleCancelar = () => {
    setModalAberto(false);
    setEstoqueEditando(null);
    setFormData({
      id_estoque: '',
      id_produto: '',
      qtd_disponivel: '',
      qtd_min: '',
      data_atualizacao: ''
    });
  };

  const handleVender = (estoque) => {
    setEstoqueVendendo(estoque);
    setFormVenda({
      quantidade: '',
      valor_total: 0
    });
    setModalVendaAberto(true);
  };

  const handleVendaChange = (e) => {
    const { name, value } = e.target;
    const quantidade = parseInt(value) || 0;
    
    if (!estoqueVendendo || !produtos) return;
    const produto = produtos.find(p => p.id_produto === estoqueVendendo.id_produto);
    const valor_total = quantidade * (produto?.valor_produto || 0);

    setFormVenda({
      quantidade: value,
      valor_total: valor_total
    });
  };

  const handleConfirmarVenda = async (e) => {
    e.preventDefault();

    const quantidade = parseInt(formVenda.quantidade);
    const novaQuantidade = estoqueVendendo.qtd_disponivel - quantidade;

    if (quantidade <= 0) {
      Swal.fire({
        title: 'Erro!',
        text: 'A quantidade deve ser maior que zero',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    if (novaQuantidade < 0) {
      Swal.fire({
        title: 'Erro!',
        text: 'Quantidade insuficiente em estoque',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    if (novaQuantidade < estoqueVendendo.qtd_min) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Esta venda deixará o estoque abaixo do mínimo',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    

    const venda = {
      id_estoque: estoqueVendendo.id_estoque,
      qtd_total: quantidade,
      valor_total: formVenda.valor_total,
      data_venda:  new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const estoqueAtualizado = {
      ...estoqueVendendo,
      qtd_disponivel: novaQuantidade,
      data_atualizacao:  new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    await ax.post(`http://localhost:8080/vendas`, venda);
    console.log("Venda registrada!");

    await ax.put(`http://localhost:8080/estoque/${estoqueVendendo.id_estoque}`, estoqueAtualizado);
    console.log("Estoque atualizado!");

    setEstoques(prev => prev.map(e =>
      e.id_estoque === estoqueVendendo.id_estoque ? estoqueAtualizado : e
    ));

    Swal.fire({
      title: 'Sucesso!',
      text: `Venda realizada com sucesso!`,
      icon: 'success',
      confirmButtonText: 'Ok'
    });

    setModalVendaAberto(false);
    setEstoqueVendendo(null);
    setFormVenda({
      quantidade: '',
      valor_total: 0
    });
  };

  const handleCancelarVenda = () => {
    setModalVendaAberto(false);
    setEstoqueVendendo(null);
    setFormVenda({
      quantidade: '',
      valor_total: 0
    });
  };

  const getProdutoInfo = () => {
    if (!estoqueVendendo || !produtos) return { desc_produto: '', valor_produto: 0 };
    const produto = produtos.find(p => p.id_produto === estoqueVendendo.id_produto);
    return {
      desc_produto: produto?.desc_produto || '',
      valor_produto: produto?.valor_produto || 0
    };
  };

  const estoqueFiltrado = estoques.filter(estoque => {
    const idEstoqueMatch = filtros.idEstoque ? estoque.id_estoque.toString().includes(filtros.idEstoque) : true;
    const produtoIdMatch = filtros.produtoId ? estoque.id_produto.toString() === filtros.produtoId : true;
    const dataMatch = filtros.data ? dayjs(estoque.data_atualizacao).isSame(dayjs(filtros.data), 'day') : true;

    return idEstoqueMatch && produtoIdMatch && dataMatch;
  }
  );

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
              {produtos.map(produto => (
                <option key={produto.id_produto} value={produto.id_produto}>
                  {produto.desc_produto}
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
            id_estoque: '',
            id_produto: '',
            qtd_disponivel: '',
            qtd_min: '',
            data_atualizacao: ''
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

            {estoques && produtos.length > 0 && estoqueFiltrado.map((estoque) => (
              <tr key={estoque.id_estoque}>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estoque.id_estoque}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produtos.find(p => p.id_produto == estoque.id_produto)?.desc_produto || 'Produto não encontrado'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estoque.qtd_disponivel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estoque.qtd_min}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dayjs(estoque.data_atualizacao).format('DD/MM/YYYY')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleEditar(estoque)}
                    className="text-gray-600 hover:text-gray-900 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleVender(estoque)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    <FaShoppingCart />
                  </button>
                  <button
                    onClick={() => handleDeletar(estoque.id_estoque)}
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
                    value={estoqueEditando.id_estoque}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Produto</label>
                  <select
                    name="id_produto"
                    value={formData.id_produto}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.map(produto => (
                      <option key={produto.id_produto} value={produto.id_produto}>
                        {produto.desc_produto}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    name="qtd_disponivel"
                    value={formData.qtd_disponivel}
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
                    name="qtd_min"
                    value={formData.qtd_min}
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
                    name="data_atualizacao"
                    value={formData.data_atualizacao}
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

      {/* Modal de Venda */}
      {modalVendaAberto && estoqueVendendo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Realizar Venda</h2>
            <form onSubmit={handleConfirmarVenda}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Produto</label>
                  <input
                    type="text"
                    value={getProdutoInfo().desc_produto}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade Disponível</label>
                  <input
                    type="text"
                    value={estoqueVendendo?.qtd_disponivel || 0}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade Mínima</label>
                  <input
                    type="text"
                    value={estoqueVendendo?.qtd_min || 0}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor Unitário</label>
                  <input
                    type="text"
                    value={`R$ ${getProdutoInfo().valor_produto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade a Vender</label>
                  <input
                    type="number"
                    name="quantidade"
                    value={formVenda.quantidade}
                    onChange={handleVendaChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                    required
                    min="1"
                    max={estoqueVendendo?.qtd_disponivel || 0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor Total</label>
                  <input
                    type="text"
                    value={`R$ ${formVenda.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelarVenda}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  Confirmar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 