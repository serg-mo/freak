import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

export function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .filter((v) => v)
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

export default function RecipeChart({ recipes }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: 'scatter',
      data: {
        datasets: [
          {
            data: recipes,
            parsing: {
              xAxisKey: 'totalSeconds',
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

              label: (context) => {
                const p = context.raw;

                return [
                  `Temp: ${p.temp}°F`,
                  `Time: ${formatTime(p.totalSeconds)}`,
                  `Intensity: ${p.intensity}`,
                  `Start: ${p.timerStart}`,
                  `End: ${p.timerEnd}`,
                ];
              },
            },
          },
        },

        scales: {
          x: {
            grid: {
              color: '#27272a',
            },
            ticks: {
              color: '#71717a',
              callback: (value) => formatTime(value),
            },
          },

          y: {
            grid: {
              color: '#27272a',
            },
            ticks: {
              color: '#71717a',
              callback: (value) => `${value}F`,
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [recipes]);

  return <canvas ref={canvasRef} className="w-full p-2" />;
}
