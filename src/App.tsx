import { FC, useEffect, useRef, useState, MouseEvent } from "react";
import init, { apply_basic_gaussian, apply_flip, apply_invert } from "rsw-cv";

const loadImage = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => reader.result && resolve(reader.result.toString());
    reader.readAsDataURL(blob);
  });
};

type ImageWrapperProps = {
  url: string;
  name: string;
  onClick: (image: string) => string;
};
const ImageWrapper: FC<ImageWrapperProps> = ({ url, name, onClick }) => {
  const filteredRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState("");

  const handleApplyFilter = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.currentTarget.disabled = true;
    if (!filteredRef.current) return;
    filteredRef.current.src = onClick(image);
  };

  useEffect(() => void loadImage(url).then(setImage), []);

  return (
    <div
      className="w-full flex flex-col shadow-zinc-900 shadow bg-zinc-800 rounded-xl overflow-hidden"
      style={{ minHeight: "500px" }}
    >
      <p className="p-2">{name}</p>
      <div
        className="overflow-hidden gap-5 p-5 w-full h-full grid grid-rows-2 grid-cols-1"
        style={{ gridAutoRows: "1fr" }}
      >
        <div className="overflow-hidden ">
          <img src={image} className="w-full h-full " />
        </div>
        <div className="overflow-hidden bg-zinc-900">
          <img ref={filteredRef} className="h-full w-full " />
        </div>
      </div>
      <button
        className="p-2 w-full bg-zinc-700 transition hover:underline hover:bg-zinc-900 cursor-pointer"
        onClick={handleApplyFilter}
      >
        Apply Filter
      </button>
    </div>
  );
};

function App() {
  useEffect(() => {
    init();
  }, []);

  const applyGaussian = (image: string) => apply_basic_gaussian(image);
  const applyInvert = (image: string) => apply_invert(image);
  const applyFlip = (image: string) => apply_flip(image);

  return (
    <div className="h-screen flex gap-5 bg-zinc-600 overflow-auto text-gray-200 p-5">
      <ImageWrapper
        url="https://picsum.photos/400/400"
        onClick={applyGaussian}
        name="Gaussian"
      />
      <ImageWrapper
        name="Invert"
        url="https://picsum.photos/400/400"
        onClick={applyInvert}
      />
      <ImageWrapper
        name="Flip"
        url="https://picsum.photos/400/400"
        onClick={applyFlip}
      />
    </div>
  );
}

export default App;
