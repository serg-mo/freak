import React, { useState } from 'react';

async function loadFileContent(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

function Target({ children, onClick }) {
  return (
    <div className="relative z-0 w-full flex justify-center items-center select-none">
      <div
        className="w-96 h-96 flex flex-col justify-center items-center text-center text-5xl border-2 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
}

// <DragAndDrop>{(txts) => console.log(txts)}</DragAndDrop>
export default function DragAndDrop({ children }) {
  const [context, setContext] = useState([]); // txt of each file

  async function handleChange(event) {
    const list = Array.from(event.target.files); // FileList to Array

    if (list.length === 0) {
      return;
    }

    Promise.all(list.map(loadFileContent)).then(setContext);
  }

  if (Object.keys(context).length) {
    return children(context);
  }

  return (
    <Target>
      <div className="relative z-0 w-full flex justify-center items-center">
        <input
          type="file"
          multiple
          onChange={handleChange}
          accept=".FA1"
          className="absolute inset-0 flex justify-center items-center z-10 w-full opacity-0 cursor-pointer"
        />
        <div className="text-5xl">Drag and Drop FA1</div>
      </div>
    </Target>
  );
}
