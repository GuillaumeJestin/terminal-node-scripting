import useRegisterFunction from "../hooks/useRegisterFunction";

const Background = () => {

  const registerChar = useRegisterFunction();

  return registerChar((x, y) => {
    if (x % 16 === 0 && y % 8 === 0) return { char: "·", position: -1 };

    return undefined;
  });
}

export default Background;