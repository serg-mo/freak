import { useState } from 'react';

import RecipeChart from './RecipeChart.jsx';
import ReceipeTable from './RecipeTable.jsx';

export default function Recipes({ recipes, names, toggleName }) {
  return (
    <div className="w-full bg-zinc-950 text-zinc-100 flex flex-col gap-4 p-3 sm:p-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 hidden sm:block">
        <RecipeChart recipes={recipes} onClick={toggleName} names={names} />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80">
        <ReceipeTable recipes={recipes} onClick={toggleName} names={names} />
      </div>
    </div>
  );
}
