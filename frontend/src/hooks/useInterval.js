import { useEffect } from "react";

export default function useInterval(callback, delay) {
  useEffect(() => {
    function tick() {
      callback();
    }
    let id = setInterval(tick, delay);
    if (delay === null) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [delay, callback]);
}
