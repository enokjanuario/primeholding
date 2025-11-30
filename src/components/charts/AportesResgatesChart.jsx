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
import { formatCurrency } from '../../utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function AportesResgatesChart({ dados = [] }) {
  const chartData = useMemo(() => ({
    labels: dados.map(d => d.mesAno),
    datasets: [
      {
        label: 'Aportes',
        data: dados.map(d => d.aportes),
        backgroundColor: 'rgba(40, 167, 69, 0.8)',
        borderColor: '#28A745',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Resgates',
        data: dados.map(d => d.resgates),
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        borderColor: '#DC3545',
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
        position: 'top',
        align: 'end',
        labels: {
          color: '#B1B1B1',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#2D2D2D',
        titleColor: '#FFFFFF',
        bodyColor: '#B1B1B1',
        borderColor: '#3B3B3B',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
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
          callback: (value) => formatCurrency(value),
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

export default AportesResgatesChart
