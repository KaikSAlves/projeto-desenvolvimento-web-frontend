import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ax from 'axios';
import { FaExclamationTriangle } from 'react-icons/fa';
import Swal from 'sweetalert2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminRelatiorios = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [vendasData, setVendasData] = useState([]);
  const [produtosData, setProdutosData] = useState([]);
  const [estoquesData, setEstoquesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtosParaReposicao, setProdutosParaReposicao] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  // Carregar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendasResponse, produtosResponse, estoquesResponse] = await Promise.all([
          ax.get('http://localhost:8080/vendas'),
          ax.get('http://localhost:8080/produto'),
          ax.get('http://localhost:8080/estoque')
        ]);

        console.log('Dados carregados:', {
          vendas: vendasResponse.data,
          produtos: produtosResponse.data,
          estoques: estoquesResponse.data
        });

        setVendasData(vendasResponse.data);
        setProdutosData(produtosResponse.data);
        setEstoquesData(estoquesResponse.data);

        // Processar produtos que precisam de reposição
        const produtosParaRepor = estoquesResponse.data
          .filter(estoque => estoque.qtd_disponivel <= estoque.qtd_min)
          .map(estoque => {
            // Encontrar o produto correspondente ao estoque
            const produto = produtosResponse.data.find(p => p.id_produto === estoque.id_produto);
            
            console.log('Processando estoque:', {
              estoque,
              produtoEncontrado: produto,
              id_produto_estoque: estoque.id_produto,
              produtosDisponiveis: produtosResponse.data.map(p => ({ id: p.id_produto, nome: p.nome_produto }))
            });

            if (!produto) {
              console.warn(`Produto não encontrado para o estoque:`, estoque);
            }

            return {
              ...estoque,
              nome_produto: produto?.nome_produto || 'Produto não encontrado',
              tipo_produto: produto?.tipo_produto || 'Tipo não encontrado',
              sabor_produto: produto?.sabor_produto || 'Sabor não encontrado'
            };
          });

        console.log('Produtos para reposição:', produtosParaRepor);
        setProdutosParaReposicao(produtosParaRepor);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Processar dados para os gráficos
  const processData = () => {
    if (!vendasData.length || !produtosData.length || !estoquesData.length) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrar vendas por período
    const vendasFiltradas = vendasData.filter(venda => {
      const dataVenda = new Date(venda.data_venda);
      if (timePeriod === 'month') {
        return dataVenda.getMonth() === currentMonth && dataVenda.getFullYear() === currentYear;
      } else if (timePeriod === 'week') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        return dataVenda >= startOfWeek && dataVenda <= endOfWeek;
      } else {
        // 'all' selecionado
        return true;
      }
    });

    // Processar dados de vendas por tipo de produto
    const vendasPorTipo = vendasFiltradas.reduce((acc, venda) => {
      const estoque = estoquesData.find(e => e.id_estoque === venda.id_estoque);
      if (estoque) {
        const produto = produtosData.find(p => p.id_produto === estoque.id_produto);
        if (produto) {
          const tipo = produto.tipo_produto;
          acc[tipo] = (acc[tipo] || 0) + venda.qtd_total;
        }
      }
      return acc;
    }, {});

    // Processar dados de vendas por sabor, considerando o filtro de tipo
    const vendasPorSabor = vendasFiltradas.reduce((acc, venda) => {
      const estoque = estoquesData.find(e => e.id_estoque === venda.id_estoque);
      if (estoque) {
        const produto = produtosData.find(p => p.id_produto === estoque.id_produto);
        if (produto) {
          if (tipoFiltro === 'todos' || produto.tipo_produto === tipoFiltro) {
            const sabor = produto.sabor_produto;
            acc[sabor] = (acc[sabor] || 0) + venda.qtd_total;
          }
        }
      }
      return acc;
    }, {});

    // Ordenar sabores por quantidade vendida
    const saboresOrdenados = Object.entries(vendasPorSabor)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 sabores

    return {
      vendasPorTipo,
      vendasPorSabor: Object.fromEntries(saboresOrdenados)
    };
  };

  const processedData = processData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Vendas por ${timePeriod === 'month' ? 'Mês' : timePeriod === 'week' ? 'Semana' : 'Todos os Períodos'}`,
      },
    },
  };

  // Função para excluir venda
  const handleExcluirVenda = async (id_venda) => {
    try {
      await ax.delete(`http://localhost:8080/vendas/${id_venda}`);
      setVendasData(prev => prev.filter(v => v.id_venda !== id_venda));
      Swal.fire({
        title: 'Sucesso!',
        text: `A venda ${id_venda} foi excluída com sucesso!`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível excluir a venda.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Relatórios de Vendas</h2>
        <div className="text-center">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Relatórios de Vendas</h2>
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
            >
              <option value="all">Todos</option>
              <option value="month">Por Mês</option>
              <option value="week">Por Semana</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h5 className="text-lg font-semibold text-gray-800 mb-4">Vendas por Tipo de Produto</h5>
          <div className="h-[400px]">
            <Bar 
              data={{
                labels: Object.keys(processedData?.vendasPorTipo || {}),
                datasets: [{
                  label: 'Quantidade Vendida',
                  data: Object.values(processedData?.vendasPorTipo || {}),
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                  ],
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h5 className="text-lg font-semibold text-gray-800">Top 5 Sabores Mais Vendidos</h5>
            <div>
              <label className="mr-2 text-sm font-medium text-gray-700">Tipo:</label>
              <select
                value={tipoFiltro}
                onChange={e => setTipoFiltro(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
              >
                <option value="todos">Todos</option>
                <option value="Picolé">Picolé</option>
                <option value="Geladinho">Geladinho</option>
              </select>
            </div>
          </div>
          <div className="h-[400px]">
            <Pie 
              data={{
                labels: Object.keys(processedData?.vendasPorSabor || {}),
                datasets: [{
                  data: Object.values(processedData?.vendasPorSabor || {}),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                  ],
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4">Resumo de Vendas</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h6 className="text-blue-600 font-semibold">Total de Vendas</h6>
            <p className="text-2xl font-bold text-gray-800">
              {vendasData.reduce((acc, venda) => acc + venda.qtd_total, 0)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h6 className="text-green-600 font-semibold">Vendas do Período</h6>
            <p className="text-2xl font-bold text-gray-800">
              {Object.values(processedData?.vendasPorTipo || {}).reduce((acc, val) => acc + val, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h6 className="text-purple-600 font-semibold">Ticket Médio</h6>
            <p className="text-2xl font-bold text-gray-800">
              R$ {(vendasData.reduce((acc, venda) => acc + venda.valor_total, 0) / 
                   (vendasData.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Avisos de Reposição */}
      {produtosParaReposicao.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-yellow-500 text-xl" />
            <h5 className="text-lg font-semibold text-gray-800">Avisos de Reposição</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID do Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sabor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade Mínima
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtosParaReposicao.map((produto) => (
                  <tr key={produto.id_estoque} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {produto.id_estoque}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {produto.desc_produto || produto.nome_produto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {produto.tipo_produto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {produto.sabor_produto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {produto.qtd_disponivel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {produto.qtd_min}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Histórico de Vendas */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Vendas</h5>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendasData.map((venda) => {
                const estoque = estoquesData.find(e => e.id_estoque === venda.id_estoque);
                const produto = estoque ? produtosData.find(p => p.id_produto === estoque.id_produto) : null;
                return (
                  <tr key={venda.id_venda}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venda.id_venda}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto?.desc_produto || produto?.nome_produto || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto?.sabor_produto || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto?.tipo_produto || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venda.qtd_total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(venda.data_venda).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venda.id_estoque}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleExcluirVenda(venda.id_venda)}
                        className="text-red-600 hover:text-red-900 font-bold"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRelatiorios; 