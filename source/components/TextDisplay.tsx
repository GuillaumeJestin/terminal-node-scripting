import useRegisterFunction from "../hooks/useRegisterFunction";

type TextDisplayProps = {
  x: number;
  y: number;
  text: string;
  zIndex?: number;
  color?: string;
  backgroundColor?: string;
}

const TextDisplay = ({ x: textX, y: textY, text, zIndex = 0, color, backgroundColor }: TextDisplayProps) => {

  const registerChar = useRegisterFunction();

  const width = text.length;

  return registerChar((x, y) => {
    if (x < textX || x > (textX + width) || y < textY || y > textY) return undefined;

    const index = x - textX;

    const char = text[index];

    if (char !== undefined) {
      return { char, position: zIndex, color, backgroundColor }
    }

    return undefined;
  });
}

export default TextDisplay;