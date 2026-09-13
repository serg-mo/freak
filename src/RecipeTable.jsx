import { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { formatTime } from './utils.js';

export default function RecipeTable({ recipes }) {
  const [sort, setSort] = useState({ key: 'name', desc: false }); // asc by default

  const columns = [
    ['name', 'Name'],
    ['temp', 'Temp'],
    ['totalSeconds', 'Time'],
    ['timerStart', 'Start'],
    ['timerEnd', 'End'],
    ['intensity', 'Intensity'],
  ];

  const sortedRecipes = [...recipes].sort((a, b) => {
    const result = String(a[sort.key]).localeCompare(
      String(b[sort.key]),
      undefined,
      {
        numeric: true,
      },
    );
    return sort.desc ? -result : result;
  });

  const toggleSort = (key) =>
    setSort((s) => ({ key, desc: s.key === key ? !s.desc : false }));

  return (
    <table className="w-full text-xs sm:text-sm text-nowrap">
      <thead className="border-b border-zinc-800 text-left uppercase text-zinc-500">
        <tr>
          {columns.map(([key, label], index) => (
            <th
              key={key}
              onClick={() => toggleSort(key)}
              className={`cursor-pointer p-2 hover:text-zinc-200 select-none ${index > 2 ? 'hidden sm:table-cell' : ''}`}
            >
              <span className="inline-flex items-center">
                {label}
                <span className="inline-flex w-4 justify-center">
                  {sort.key === key &&
                    (sort.desc ? (
                      <IconChevronDown size={15} stroke={1.75} />
                    ) : (
                      <IconChevronUp size={15} stroke={1.75} />
                    ))}
                </span>
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-zinc-800/80">
        {sortedRecipes.map((recipe, index) => (
          <tr
            key={`${recipe.name}-${index}`}
            className="group transition-colors hover:bg-zinc-800/40"
          >
            <td className="p-2 w-auto">{recipe.name}</td>
            <td className="p-2">{recipe.temp}F</td>
            <td className="p-2">{formatTime(recipe)}</td>

            <td className="p-2 hidden sm:table-cell">{recipe.timerStart}</td>
            <td className="p-2 hidden sm:table-cell">{recipe.timerEnd}</td>
            <td className="p-2 hidden sm:table-cell">{recipe.intensity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
