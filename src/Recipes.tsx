import RecipeChart from './RecipeChart';
import RecipeTable from './RecipeTable';
import type { Recipe } from './types';

type RecipesProps = {
  recipes: Recipe[];
  names: string[];
  toggleName: (name: string) => void;
};

export default function Recipes({ recipes, names, toggleName }: RecipesProps) {
  return (
    <div className="w-full bg-zinc-950 text-zinc-100 flex flex-col gap-4 p-3 sm:p-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 hidden sm:block">
        <RecipeChart recipes={recipes} toggleName={toggleName} names={names} />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80">
        <RecipeTable recipes={recipes} toggleName={toggleName} names={names} />
      </div>
    </div>
  );
}
