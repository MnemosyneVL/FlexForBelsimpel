// useDebounce hook — delays updating a value until the user stops typing.
//
// Without debouncing, typing "samsung" would trigger 7 search requests:
// "s", "sa", "sam", "sams", "samsu", "samsun", "samsung"
//
// With a 300ms debounce, we only search after the user pauses for 300ms.
// So typing "samsung" quickly triggers just ONE request for "samsung".

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Start a timer — when it fires, update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // If the value changes before the timer fires, cancel the old timer.
    // This is the "cleanup" function — React calls it before running the
    // effect again or when the component unmounts.
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
