import { useEffect } from "react";

export function useFocusAtEnd(ref, enabled = true) {
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    element.focus();
    const end = element.value.length;
    element.setSelectionRange(end, end); // cursor after the last character
  }, [ref, enabled]);
}