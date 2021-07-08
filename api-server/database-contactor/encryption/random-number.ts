export function generateConfirmationCode(length: number = 6) {
  const lowest = Math.pow(10, length - 1);
  const highest = Math.pow(10, length - 1);
  return Math.floor(Math.random() * highest) + lowest;
}
