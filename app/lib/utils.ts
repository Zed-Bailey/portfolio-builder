import { clsx, type ClassValue } from "clsx"
import { useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const useFormInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}

export const useSelectInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e);
  }

  const inputProps = {
    value: value,
    onValueChange: handleChange
  };

  return inputProps;
}

/**
 * returns the percentage a is of b
 * @param a 
 * @param b 
 */
export const percentageOf = (a: number, b: number) => {
  return (a / b) * 100;
}
