import _ from "lodash";
import { useMemo } from "react";
import useRegisterFunction from "../hooks/useRegisterFunction";

type LineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  zIndex?: number;
}

const Line = ({ x1, y1, x2, y2, zIndex = 0 }: LineProps) => {

  const registerChar = useRegisterFunction();

  const linePoints = useMemo(() => computeCharForEachPoint(plotLine(x1, y1, x2, y2)), [x1, y1, x2, y2]);

  return registerChar((x, y) => {
    const linePoint = linePoints.find(point => point[0] === x && point[1] === y);

    if (linePoint) {
      return { char: linePoint[2], position: zIndex };
    }

    return undefined;
  });
}

export default Line;

const charByAngles = [
  { angles: [Math.PI, 0], char: "─" },
  { angles: [Math.PI / 2, 3 * Math.PI / 2], char: "│" },
  { angles: [Math.PI, Math.PI / 2], char: "╮" },
  { angles: [3 * Math.PI / 2, 0], char: "╰" },
  { angles: [Math.PI, 3 * Math.PI / 2], char: "╯" },
  { angles: [Math.PI / 2, 0], char: "╭" },
]

const computeCharForEachPoint = (points: [number, number][]): [number, number, string][] => {

  if (points.length < 2) return points.map(point => [...point, "c"]);

  const wildchar = "#";

  const res: [number, number, string][] = [];

  const firstVec = [points[1]![0] - points[0]![0], points[1]![1] - points[0]![1]] as const;
  const firstAngle = (Math.atan2(firstVec![1], firstVec![0]) + 2 * Math.PI) % (2 * Math.PI);
  const charForFirstAngles = charByAngles.find(({ angles }) => _.isEqual(angles, [Math.PI, firstAngle]));
  res.push([points[0]![0], points[0]![1], charForFirstAngles?.char ?? wildchar]);

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]!;
    const current = points[i]!;
    const next = points[i + 1]!;

    let char = wildchar;

    const vec1 = [prev[0] - current[0], prev[1] - current[1]] as const;
    const vec2 = [next[0] - current[0], next[1] - current[1]] as const;

    const angle1 = (Math.atan2(vec1![1], vec1![0]) + 2 * Math.PI) % (2 * Math.PI);
    const angle2 = (Math.atan2(vec2![1], vec2![0]) + 2 * Math.PI) % (2 * Math.PI);

    const charForThoseAngle = charByAngles.find(({ angles }) => _.isEqual(angles, [angle1, angle2]));

    if (charForThoseAngle) {
      char = charForThoseAngle.char;
    }

    res.push([points[i]![0], points[i]![1], char, angle1, angle2] as any);
  }

  const lastVec = [points[points.length - 2]![0] - points[points.length - 1]![0], points[points.length - 2]![1] - points[points.length - 1]![1]] as const;
  const lastAngle = (Math.atan2(lastVec![1], lastVec![0]) + 2 * Math.PI) % (2 * Math.PI);
  const charForLastAngles = charByAngles.find(({ angles }) => _.isEqual(angles, [lastAngle, 0]));
  res.push([points[points.length - 1]![0], points[points.length - 1]![1], charForLastAngles?.char ?? wildchar]);

  return res;
}

const plotLineHigh = (x1: number, y1: number, x2: number, y2: number, res: [number, number][]) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let xi = 1;
  if (dx < 0) {
    xi = -1;
    dx = -dx;
  }
  let D = (2 * dx) - dy;
  let x = x1;

  for (let y = y1; y <= y2; y++) {
    res.push([Math.floor(x), Math.floor(y)]);
    if (D > 0) {
      x = x + xi;
      D = D + (2 * (dx - dy));
    } else {
      D = D + 2 * dx
    }
  }
}

const plotLineLow = (x1: number, y1: number, x2: number, y2: number, res: [number, number][]) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let yi = 1;
  if (dy < 0) {
    yi = -1;
    dy = -dy;
  }
  let D = (2 * dy) - dx;
  let y = y1;

  for (let x = x1; x <= x2; x++) {
    res.push([Math.floor(x), Math.floor(y)]);
    if (D > 0) {
      y = y + yi;
      D = D + (2 * (dy - dx));
    } else {
      D = D + 2 * dy
    }
  }
}

const plotLine = (x1: number, y1: number, x2: number, y2: number) => {
  const res: [number, number][] = [];

  if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {
    if (x1 > x2) {
      plotLineLow(x2, y2, x1, y1, res);
    } else {
      plotLineLow(x1, y1, x2, y2, res);
    }
  } else {
    if (y1 > y1) {
      plotLineHigh(x2, y1, x1, y1, res);
    } else {

    } plotLineHigh(x1, y1, x2, y1, res);
  }

  return extendPlotLine(res);
}

const extendPlotLine = (line: [number, number][]) => {
  const newLine: [number, number][] = [];

  for (let index = 0; index < line.length - 1; index++) {
    const current = line[index]!;
    const next = line[index + 1]!;

    newLine.push(current);

    const a: [number, number] = [current[0], next[1]];
    const b: [number, number] = [next[0], current[1]];

    if (a[1] < b[1]) {
      newLine.push(a);
    } else {
      newLine.push(b);
    }
  }

  newLine.push(line[line.length - 1]!);

  return _.uniqWith(newLine, _.isEqual);
}