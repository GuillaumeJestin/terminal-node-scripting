import useRegisterFunction from "../hooks/useRegisterFunction";

type RectangleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
}

const Rectangle = ({ x: rectX, y: rectY, width, height, zIndex = 0 }: RectangleProps) => {

  const registerChar = useRegisterFunction();

  return registerChar((x, y) => {
    if (x < rectX || x > (rectX + width) || y < rectY || y > (rectY + height)) return undefined;

    if (x === rectX && y === rectY) return { char: "┌", position: zIndex };
    if (x === (rectX + width) && y === rectY) return { char: "┐", position: zIndex };
    if (x === rectX && y === (rectY + height)) return { char: "└", position: zIndex };
    if (x === (rectX + width) && y === (rectY + height)) return { char: "┘", position: zIndex };

    if (x === rectX || x === (rectX + width)) return { char: "│", position: zIndex };
    if (y === rectY || y === (rectY + height)) return { char: "─", position: zIndex };

    return undefined;
  });
}

export default Rectangle;