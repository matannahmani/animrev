export const ratingToColor = (rating: number) => {
  // scale 1-100
  if (rating < 1) {
    return "bg-gray-300 text-gray-500";
  }
  if (rating < 60) {
    return "bg-red-500 text-white";
  }
  if (rating < 70) {
    return "bg-yellow-500 text-gray-800";
  }
  if (rating < 80) {
    return "bg-green-500 text-white";
  }
  if (rating < 90) {
    return "bg-blue-500 text-white";
  }
  return "bg-purple-500 text-white";
};
