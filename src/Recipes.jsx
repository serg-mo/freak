import { useEffect, useState } from 'react';

import RecipeChart from './RecipeChart.jsx';
import ReceipeTable from './RecipeTable.jsx';

export default function Recipes({ recipes }) {
  return (
    <div className="bg-zinc-950 text-zinc-100 flex flex-col gap-4 p-3 sm:p-6">
      <div className="mx-auto w-2/3 p-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 hidden sm:block">
        <RecipeChart recipes={recipes} />
      </div>

      <div className="mx-auto w-full sm:w-2/3 p-2 rounded-2xl border border-zinc-800 bg-zinc-900/80">
        <ReceipeTable recipes={recipes} />
      </div>
    </div>
  );
}
