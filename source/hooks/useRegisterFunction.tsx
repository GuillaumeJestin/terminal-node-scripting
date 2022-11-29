import _ from "lodash";
import { useCallback, useContext, useEffect, useRef } from "react";
import { RegisterContext } from "../ui";

const useRegisterFunction = () => {
  const idRef = useRef(_.uniqueId());

  const { registerChar, unregisterChar } = useContext(RegisterContext);

  useEffect(() => {
    const id = idRef.current;
    return () => { unregisterChar(id) };
  }, []);

  const newRegisterChar = useCallback((func: (x: number, y: number) => { char: string; position: number; color?: string, backgroundColor?: string } | undefined) => {
    return registerChar(func, idRef.current);
  }, [registerChar]);

  return newRegisterChar;
}

export default useRegisterFunction;