import { useState, type ReactNode } from 'react';

async function loadFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function Target({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
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

type DragAndDropProps = {
  children: (txts: string[]) => ReactNode | void;
};

// <DragAndDrop>{(txts) => console.log(txts)}</DragAndDrop>
export default function DragAndDrop({ children }: DragAndDropProps) {
  const [context, setContext] = useState<string[]>([]);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(event.target.files ?? []);

    if (list.length === 0) {
      return;
    }

    Promise.all(list.map(loadFileContent)).then(setContext);
  }

  if (context.length) {
    return children(context) ?? null;
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
