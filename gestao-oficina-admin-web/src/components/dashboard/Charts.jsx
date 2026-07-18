import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

const ink = '#0f161e';
const signal = '#e85d04';
const sky = '#0ea5e9';
const emerald = '#059669';
const amber = '#d97706';
const slate = '#64748b';

const STATUS_COLORS = {
  OPEN: slate,
  IN_PROGRESS: sky,
  WAITING_PARTS: amber,
  READY: emerald,
  DELIVERED: '#334155',
  CANCELLED: '#dc2626',
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { boxWidth: 12, font: { size: 11, family: 'IBM Plex Sans, sans-serif' } },
    },
    tooltip: {
      titleFont: { family: 'IBM Plex Sans, sans-serif' },
      bodyFont: { family: 'IBM Plex Sans, sans-serif' },
    },
  },
};

export function EvolutionChart({ labels, ordersData, revenueData, paidRevenueData }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Receita total (R$)',
        data: revenueData,
        borderColor: slate,
        backgroundColor: 'transparent',
        borderDash: [5, 4],
        tension: 0.35,
        yAxisID: 'y',
      },
      {
        label: 'Receita paga (R$)',
        data: paidRevenueData,
        borderColor: signal,
        backgroundColor: 'rgba(232, 93, 4, 0.12)',
        fill: true,
        tension: 0.35,
        yAxisID: 'y',
      },
      {
        label: 'OS no mês',
        data: ordersData,
        borderColor: ink,
        backgroundColor: 'transparent',
        tension: 0.35,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    ...baseOptions,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        ticks: { callback: (v) => `R$ ${v}` },
        grid: { color: 'rgba(15,22,30,0.06)' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { stepSize: 1 },
      },
      x: { grid: { display: false } },
    },
  };

  return <Line data={data} options={options} />;
}

export function StatusBarChart({ rows }) {
  const data = {
    labels: rows.map((r) => r.label),
    datasets: [
      {
        label: 'OS',
        data: rows.map((r) => r.count),
        backgroundColor: rows.map((r) => STATUS_COLORS[r.code] || slate),
        borderRadius: 8,
        barThickness: 22,
      },
    ],
  };

  const options = {
    ...baseOptions,
    indexAxis: 'y',
    plugins: { ...baseOptions.plugins, legend: { display: false } },
    scales: {
      x: { ticks: { stepSize: 1 }, grid: { color: 'rgba(15,22,30,0.06)' } },
      y: { grid: { display: false } },
    },
  };

  return <Bar data={data} options={options} />;
}

export function MixDoughnut({ serviceRevenue, partsRevenue }) {
  const data = {
    labels: ['Serviços', 'Peças'],
    datasets: [
      {
        data: [serviceRevenue, partsRevenue],
        backgroundColor: [sky, signal],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    ...baseOptions,
    cutout: '62%',
    plugins: {
      ...baseOptions.plugins,
      legend: { position: 'bottom' },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export function RankingBarChart({ rows, color = signal, valueFormatter }) {
  const data = {
    labels: rows.map((r) => r.name),
    datasets: [
      {
        label: 'Receita',
        data: rows.map((r) => r.revenue ?? r.spend),
        backgroundColor: color,
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const options = {
    ...baseOptions,
    indexAxis: 'y',
    plugins: {
      ...baseOptions.plugins,
      legend: { display: false },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        callbacks: {
          label(ctx) {
            const v = ctx.parsed.x;
            return valueFormatter ? valueFormatter(v) : String(v);
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (v) => (valueFormatter ? valueFormatter(v) : v),
        },
        grid: { color: 'rgba(15,22,30,0.06)' },
      },
      y: { grid: { display: false } },
    },
  };

  return <Bar data={data} options={options} />;
}
