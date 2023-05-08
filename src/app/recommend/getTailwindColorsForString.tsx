"use client";
export function getTailwindColorsForString(input: string): string {
  const colorPairs: string[] = [
    "text-yellow-600 bg-yellow-200 hover:text-yellow-700 hover:bg-yellow-300 dark:text-yellow-300 dark:bg-gray-800 dark:hover:text-yellow-400 dark:hover:bg-gray-700",
    "text-green-600 bg-green-200 hover:text-green-700 hover:bg-green-300 dark:text-green-300 dark:bg-gray-900 dark:hover:text-green-400 dark:hover:bg-gray-800",
    "text-blue-600 bg-blue-200 hover:text-blue-700 hover:bg-blue-300 dark:text-blue-300 dark:bg-gray-800 dark:hover:text-blue-400 dark:hover:bg-gray-700",
    "text-red-600 bg-red-200 hover:text-red-700 hover:bg-red-300 dark:text-red-400 dark:bg-gray-900 dark:hover:text-red-500 dark:hover:bg-gray-800",
    "text-indigo-600 bg-indigo-200 hover:text-indigo-700 hover:bg-indigo-300 dark:text-indigo-300 dark:bg-gray-800 dark:hover:text-indigo-400 dark:hover:bg-gray-700",
    "text-purple-600 bg-purple-200 hover:text-purple-700 hover:bg-purple-300 dark:text-purple-300 dark:bg-gray-900 dark:hover:text-purple-400 dark:hover:bg-gray-800",
    "text-pink-600 bg-pink-200 hover:text-pink-700 hover:bg-pink-300 dark:text-pink-300 dark:bg-gray-800 dark:hover:text-pink-400 dark:hover:bg-gray-700",
    "text-rose-600 bg-rose-200 hover:text-rose-700 hover:bg-rose-300 dark:text-rose-300 dark:bg-gray-900 dark:hover:text-rose-400 dark:hover:bg-gray-800",
    "text-lime-600 bg-lime-200 hover:text-lime-700 hover:bg-lime-300 dark:text-lime-300 dark:bg-gray-800 dark:hover:text-lime-400 dark:hover:bg-gray-700",
  ];

  // Compute a simple hash of the input string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash = hash & hash;
  }

  // Ensure the hash is positive and calculate the index for the colorPairs array
  const index = Math.abs(hash) % colorPairs.length;
  return (colorPairs?.[index] || colorPairs[0]) as string;
}
