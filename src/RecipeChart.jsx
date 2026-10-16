import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatTime, formatTimeFromSeconds } from './utils.js';

Chart.register(ChartDataLabels);

export default function RecipeChart({ recipes, names, onClick }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: 'scatter',
      data: {
        datasets: [
          {
            data: recipes,
            parsing: {
              xAxisKey: 'totalSeconds', // must match scales.x.ticks.callback
              yAxisKey: 'temp',
            },
            pointRadius: 3,
            pointHoverRadius: 6,
            backgroundColor: '#fb923c',
            borderColor: '#fb923c',
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        onClick: (_, elements) => {
          if (elements.length) onClick(recipes[elements[0].index].name);
        },
        plugins: {
          legend: {
            display: false,
          },

          datalabels: {
            display: false,
          },

          tooltip: {
            backgroundColor: '#18181b',
            borderColor: '#3f3f46',
            borderWidth: 1,
            titleColor: '#fafafa',
            bodyColor: '#a1a1aa',
            padding: 12,

            callbacks: {
              title: (items) => items[0].raw.name,
              label: ({ raw }) => [
                `Temp: ${raw.temp}°F`,
                `Time: ${formatTime({ hours: raw.hours, minutes: raw.minutes, seconds: raw.seconds })}`,
                `Intensity: ${raw.intensity}`,
                `Start: ${raw.timerStart}`,
                `End: ${raw.timerEnd}`,
              ],
            },
          },
        },
        scales: {
          x: {
            grid: { color: '#27272a' },
            ticks: { color: '#71717a', callback: formatTimeFromSeconds },
          },

          y: {
            grid: { color: '#27272a' },
            ticks: { color: '#71717a', callback: (v) => `${v}F` },
          },
        },
      },
    });

    chartRef.current = chart;
    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, [recipes, onClick]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.data.datasets[0].pointRadius = (c) =>
      names.includes(c.raw.name) ? 6 : 3;
    chart.data.datasets[0].backgroundColor = (c) =>
      names.includes(c.raw.name) ? '#fef3c7' : '#fb923c';
    chart.data.datasets[0].borderColor = (c) =>
      names.includes(c.raw.name) ? '#fef3c7' : '#fb923c';

    chart.update('none');
  }, [names]);

  return (
    <div className="h-96 p-2 flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
