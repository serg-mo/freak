import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatTime, formatTimeFromSeconds } from './utils';
import type { Recipe } from './types';

Chart.register(ChartDataLabels);

const POINT_RADIUS = 3;

const DEFAULT_COLOR = '#fb923c';

type RecipeChartProps = {
  recipes: Recipe[];
  names: string[];
  toggleName: (name: string) => void;
};

export default function RecipeChart({
  recipes,
  names,
  toggleName,
}: RecipeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<'scatter'> | null>(null);
  const isOn = (name: string) => names.includes(name);

  const firstWord = (name: string) =>
    name.trim().split(/\s+/)[0]?.toLowerCase() ?? '';

  const counts = recipes.reduce<Record<string, number>>((acc, recipe) => {
    const word = firstWord(recipe.name);
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const colorForRecipe = (name: string) => {
    const word = firstWord(name);
    if ((counts[word] ?? 0) <= 1) return DEFAULT_COLOR;

    let hash = 0;
    for (const char of word) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }

    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [
          {
            data: recipes as unknown as { x: number; y: number }[],
            parsing: {
              xAxisKey: 'totalSeconds',
              yAxisKey: 'temp',
            },
            pointRadius: ({ raw }) =>
              isOn((raw as Recipe).name) ? POINT_RADIUS * 2 : POINT_RADIUS,
            pointHoverRadius: POINT_RADIUS * 2,
            backgroundColor: ({ raw }) => colorForRecipe((raw as Recipe).name),
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        onClick: (_, elements) => {
          const first = elements[0];
          if (first) toggleName(recipes[first.index]?.name ?? '');
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
              title: (items: TooltipItem<'scatter'>[]) =>
                `${(items[0]?.raw as Recipe | undefined)?.name ?? ''}`,
              label: ({ raw }: TooltipItem<'scatter'>) => {
                const recipe = raw as Recipe;
                return [
                  `${recipe.temp}F      ${formatTime({ hours: recipe.hours, minutes: recipe.minutes, seconds: recipe.seconds })}`,
                ];
              },
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

    const dataset = chart.data.datasets[0];
    if (!dataset) return;

    dataset.pointRadius = ({ raw }) =>
      isOn((raw as Recipe).name) ? POINT_RADIUS * 2 : POINT_RADIUS;

    chart.update('none');
  }, [names]);

  return (
    <div className="h-96 p-2 flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
