import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

const PricePerformanceChart = ({ cpus, gpus }) => {
  const chartData = {
    datasets: [
      {
        label: 'CPUs',
        data: cpus.map(item => ({ x: item.price, y: item.score, name: item.name })),
        backgroundColor: 'rgba(37, 99, 235, 0.7)', // Blue
        pointRadius: 5,
      },
      {
        label: 'GPUs',
        data: gpus.map(item => ({ x: item.price, y: item.score, name: item.name })),
        backgroundColor: 'rgba(22, 163, 74, 0.7)', // Green
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Price (USD)' },
        beginAtZero: true,
      },
      y: {
        title: { display: true, text: 'Benchmark Score' },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = context.raw;
            return `${item.name}: $${item.x}, Score: ${item.y}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Price vs Performance (Top 100 Components)',
        font: { size: 16 }
      }
    }
  };

  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default PricePerformanceChart;