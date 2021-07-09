export const colors = [
  ["#4A148C", "#ffffff"],
  ["#880E4F", "#ffffff"],
  ["#3F51B5", "#ffffff"],
  ["#1565C0", "#ffffff"],
  ["#00796B", "#ffffff"],
  ["#01579B", "#ffffff"],
  ["#3D5AFE", "#ffffff"],
  ["#AB47BC", "#ffffff"],
  ["#5C6BC0", "#ffffff"],
];

export const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};
