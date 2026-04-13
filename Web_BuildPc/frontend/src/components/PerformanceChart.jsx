import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ data, labels, title, color = 'rgba(59, 130, 246, 0.8)' }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Benchmark Score',
        data,
        backgroundColor: color,
        borderColor: color.replace('0.8', '1'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;