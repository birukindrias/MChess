import { useEffect } from "react";

export default function useInterval(callback, delay) {
  useEffect(() => {
    function tick() {
      callback();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, callback]);
}
