import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function callApi<T = any>(
  endpoint: string,
  data: FormData | Record<string, any>,
  method: string = 'POST'
): Promise<T> {
  const isFormData = data instanceof FormData;
  const response = await fetch(endpoint, {
    method,
    headers: !isFormData ? { 'Content-Type': 'application/json' } : undefined,
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
