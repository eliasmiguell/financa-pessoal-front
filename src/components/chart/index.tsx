"use client";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import useDataGraficos from '../../../hooks/useDadosGradtico';
import { Categoria, Transacao } from '../../../interface';


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
const receitasPorData: { [key: string]: number } = {};
const despesasPorData: { [key: string]: number } = {};
// Função para preparar dados do gráfico de pizza
// Função para preparar dados do gráfico de pizza
const preparePieData = (transacoes: Transacao[], categorias: Categoria[]) => {
  // Inicializa um objeto para armazenar o total de receita e despesa por categoria
  const categoriaReceitaDespesa: { [key: string]: { receita: number; despesa: number } } = {};

  categorias.forEach((categoria) => {
    categoriaReceitaDespesa[categoria.categoria_nome] = {
      receita: parseFloat(categoria.total_receita) || 0, // Garantir que seja um número
      despesa: parseFloat(categoria.total_despesa) || 0, // Garantir que seja um número
    };
  });

  // Preenche as receitas e despesas de cada categoria com os dados de transações
  transacoes.forEach((transacao) => {
    const categoriaNome = categorias.find(
      (cat) => cat.categoria_id === transacao.categoria_id
    )?.categoria_nome;

    if (categoriaNome) {
      const valor = parseFloat(transacao.valor);
      if (transacao.tipo === "receita") {
        categoriaReceitaDespesa[categoriaNome].receita += valor;
      } else if (transacao.tipo === "despesa") {
        categoriaReceitaDespesa[categoriaNome].despesa += valor;
      }
    }
  });

  // Prepara os dados para o gráfico de pizza
  const labels = Object.keys(categoriaReceitaDespesa);
  const receitas = labels.map((label) => categoriaReceitaDespesa[label].receita);
  const despesas = labels.map((label) => categoriaReceitaDespesa[label].despesa);

  return {
    labels: labels,
    datasets: [
      {
        label: "Receitas",
        data: receitas,
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB99", "#FF638499", "#FFCE5699"],
      },
      {
        label: "Despesas",
        data: despesas,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF638499", "#36A2EB99", "#FFCE5699"],
      },
    ],
  };
};

// Função para preparar dados do gráfico de linha
const prepareLineData = (transacoes: Transacao[]) => {
  const receitasPorData: { [key: string]: number } = {};
  const despesasPorData: { [key: string]: number } = {};

  transacoes.forEach((transacao) => {
    const data = transacao.date;
    const valor = parseFloat(transacao.valor);

    if (transacao.tipo === "receita") {
      receitasPorData[data] = (receitasPorData[data] || 0) + valor;
    } else if (transacao.tipo === "despesa") {
      despesasPorData[data] = (despesasPorData[data] || 0) + valor;
    }
  });

  const datas = Object.keys({ ...receitasPorData, ...despesasPorData }).sort();

  return {
    labels: datas,
    datasets: [
      {
        label: "Receitas",
        data: datas.map((date) => receitasPorData[date] || 0),
        borderColor: "#36A2EB",
        backgroundColor: "#36A2EB99",
        tension: 0.2,
        fill: true,
      },
      {
        label: "Despesas",
        data: datas.map((date) => despesasPorData[date] || 0),
        borderColor: "#FF6384",
        backgroundColor: "#FF638499",
        tension: 0.2,
        fill: true,
      },
    ],
  };
};


const FinanceCharts = () => {
  const { data, isLoading, isError, error } = useDataGraficos();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Erro ao carregar os gráficos.</div>;
  }

  // Tipagem dos dados recebidos da API
  const transacoes: Transacao[] = data?.dbtransacoes || [];
  const categorias: Categoria[] = data?.dbcategorias || [];

  // Prepara os dados para os gráficos
  const pieData = preparePieData(transacoes, categorias);
  const lineData = prepareLineData(transacoes);

  return (
    <div className="finance-charts grid grid-cols-1 sm:grid-cols-2  gap-6 ">
      <div className="chart bg-white p-4 rounded md:grid-cols-1 shadow ">
        <h2 className="text-lg font-bold mb-2">Receitas e Despesas por Categoria</h2>
        <Pie data={pieData} />
      </div>
      <div className="chart bg-white p-4 rounded shadow ">
        <h2 className="text-lg font-bold mb-2 md:mb-[30vh]">Transações ao Longo do Tempo</h2>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default FinanceCharts;
