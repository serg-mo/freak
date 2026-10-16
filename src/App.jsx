import { useEffect, useState } from 'react';
import Recipes from './Recipes.jsx';
import { loadFile, parseFile } from './loader.js';
import DragAndDrop from './DragAndDrop';

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [names, setNames] = useState([]);

  const toggleName = (name) => {
    setNames((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  useEffect(() => {
    const FILE_URL = 'CMC850.FA1'; // must be relative
    const load = async () =>
      await loadFile(FILE_URL)
        .then(parseFile)
        .then((recipes) =>
          setRecipes(recipes.filter((recipe) => recipe.totalSeconds < 15 * 60)),
        )
        .catch(console.error);
    load();
  }, []);

  const handleTxts = (txts) => {
    const bytes = Uint8Array.from(txts[0], (c) => c.charCodeAt(0));
    const recipes = parseFile(new DataView(bytes.buffer));
    setRecipes(recipes.filter((recipe) => recipe.totalSeconds < 15 * 60));
  };

  if (!recipes.length) {
    return (
      <>
        <DragAndDrop>{handleTxts}</DragAndDrop>
        <div className="text-center">Breville Control Freak Recipes</div>
      </>
    );
  }

  return <Recipes recipes={recipes} names={names} toggleName={toggleName} />;
}
