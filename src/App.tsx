import { useEffect, useState } from 'react';
import Recipes from './Recipes';
import { loadFile, parseFile } from './loader';
import DragAndDrop from './DragAndDrop';
import type { Recipe } from './types';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // NOTE: selected recipe names live in the url query string
  const [names, setNames] = useState<string[]>(
    () =>
      new URLSearchParams(window.location.search)
        .get('names')
        ?.split(',')
        .filter(Boolean) ?? [],
  );

  const toggleName = (name: string) => {
    setNames((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('names', names.join(',')); // overwrite
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', url);
  }, [names]);

  useEffect(() => {
    const FILE_URL = 'CMC850.FA1';

    loadFile(FILE_URL)
      .then(parseFile)
      .then((recipes) =>
        setRecipes(recipes.filter((recipe) => recipe.totalSeconds < 15 * 60)),
      )
      .catch(console.error);
  }, []);

  const handleTxts = (txts: string[]) => {
    const first = txts[0];
    if (first === undefined) {
      return;
    }

    const bytes = Uint8Array.from(first, (c) => c.charCodeAt(0));
    const recipes = parseFile(new DataView(bytes.buffer));

    setRecipes(recipes.filter((recipe) => recipe.totalSeconds < 15 * 60));
  };

  if (!recipes.length) {
    return (
      <>
        <DragAndDrop>{handleTxts}</DragAndDrop>
        <div className="text-center">Recipe</div>
      </>
    );
  }

  return <Recipes recipes={recipes} names={names} toggleName={toggleName} />;
}
