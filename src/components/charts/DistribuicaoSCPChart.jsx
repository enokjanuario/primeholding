import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { formatCurrency, formatPercent } from '../../utils/formatters'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = [
  '#C9A227', // Dourado
  '#E5C85C', // Dourado claro
  '#9A7B1C', // Dourado escuro
  '#17A2B8', // Info/Azul
  '#28A745', // Verde
  '#6C757D', // Cinza
]

function DistribuicaoSCPChart({ dados = [] }) {
  const chartData = useMemo(() => ({
    labels: dados.map(d => d.scp),
    datasets: [
      {
        data: dados.map(d => d.valor),
        backgroundColor: COLORS.slice(0, dados.length),
        borderColor: '#2D2D2D',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }), [dados])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
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
          label: (context) => {
            const item = dados[context.dataIndex]
            return [
              formatCurrency(item.valor),
              `${formatPercent(item.percentual, 1)} do total`,
            ]
          },
        },
      },
    },
  }), [dados])

  if (dados.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted">
        Nenhum dado disponível
      </div>
    )
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

export default DistribuicaoSCPChart
