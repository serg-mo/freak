import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatTime, formatTimeFromSeconds } from './utils.js';

Chart.register(ChartDataLabels);

const POINT_RADIUS = 3;

const DEFAULT_COLOR = '#fb923c';

export default function RecipeChart({ recipes, names, toggleName }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const isOn = (name) => names.includes(name);

  const firstWord = (name) => name.trim().split(/\s+/)[0]?.toLowerCase() ?? '';

  const counts = recipes.reduce((acc, recipe) => {
    const word = firstWord(recipe.name);
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const colorForRecipe = (name) => {
    const word = firstWord(name);
    if (counts[word] <= 1) return DEFAULT_COLOR;

    let hash = 0;
    for (const char of word) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }

    return `hsl(${hash % 360}, 70%, 60%)`;
  };

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
            pointRadius: ({ raw }) =>
              isOn(raw.name) ? POINT_RADIUS * 2 : POINT_RADIUS,
            pointHoverRadius: POINT_RADIUS * 2,
            backgroundColor: ({ raw }) => colorForRecipe(raw.name),
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        onClick: (_, elements) => {
          if (elements.length) toggleName(recipes[elements[0].index].name);
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
  }, [recipes, toggleName]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.data.datasets[0].pointRadius = ({ raw }) =>
      isOn(raw.name) ? POINT_RADIUS * 2 : POINT_RADIUS;

    chart.update('none');
  }, [names]);

  return (
    <div className="h-96 p-2 flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
