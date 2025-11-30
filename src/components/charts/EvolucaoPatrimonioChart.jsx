import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatCurrency } from '../../utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function EvolucaoPatrimonioChart({ dados = [] }) {
  const chartData = useMemo(() => ({
    labels: dados.map(d => d.mesAno),
    datasets: [
      {
        label: 'Patrimônio',
        data: dados.map(d => d.patrimonio),
        borderColor: '#C9A227',
        backgroundColor: 'rgba(201, 162, 39, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#C9A227',
        pointBorderColor: '#C9A227',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }), [dados])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2D2D2D',
        titleColor: '#FFFFFF',
        bodyColor: '#B1B1B1',
        borderColor: '#3B3B3B',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => formatCurrency(context.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(59, 59, 59, 0.5)',
        },
        ticks: {
          color: '#7E7E7E',
        },
      },
      y: {
        grid: {
          color: 'rgba(59, 59, 59, 0.5)',
        },
        ticks: {
          color: '#7E7E7E',
          callback: (value) => formatCurrency(value),
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }), [])

  if (dados.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted">
        Nenhum dado disponível
      </div>
    )
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default EvolucaoPatrimonioChart
