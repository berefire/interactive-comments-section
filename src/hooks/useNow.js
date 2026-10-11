import { useEffect, useState } from "react";

export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id); // cleanup when the component unmounts
  }, [intervalMs]);

  return now;
}