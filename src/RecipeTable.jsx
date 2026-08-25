import { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

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

  const time = (r) =>
    [
      r.hours && String(r.hours).padStart(2, '0'),
      String(r.minutes).padStart(2, '0'),
      String(r.seconds).padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':');

  return (
    <table className="mx-auto text-sm text-nowrap">
      <thead className="border-b border-zinc-800 text-left text-xs uppercase text-zinc-500">
        <tr>
          {columns.map(([key, label]) => (
            <th
              key={key}
              onClick={() => toggleSort(key)}
              className="cursor-pointer p-2 hover:text-zinc-200 select-none"
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
            <td className="p-2 w-content">{recipe.name}</td>

            <td className="p-2">{recipe.temp}F</td>
            <td className="p-2">{time(recipe)}</td>
            <td className="p-2">{recipe.timerStart}</td>
            <td className="p-2">{recipe.timerEnd}</td>
            <td className="p-2">{recipe.intensity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
