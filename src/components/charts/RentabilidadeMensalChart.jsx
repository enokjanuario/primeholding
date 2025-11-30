import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatPercent } from '../../utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function RentabilidadeMensalChart({ dados = [] }) {
  const chartData = useMemo(() => ({
    labels: dados.map(d => d.mesAno),
    datasets: [
      {
        label: 'Rentabilidade',
        data: dados.map(d => d.rentabilidade),
        backgroundColor: dados.map(d =>
          d.rentabilidade >= 0 ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)'
        ),
        borderColor: dados.map(d =>
          d.rentabilidade >= 0 ? '#28A745' : '#DC3545'
        ),
        borderWidth: 1,
        borderRadius: 4,
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
          label: (context) => formatPercent(context.parsed.y, 2, true),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
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
          callback: (value) => formatPercent(value, 1),
        },
      },
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
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default RentabilidadeMensalChart
