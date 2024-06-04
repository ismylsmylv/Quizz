export function generateRandomNumbersSummingTo100(count) {
  // Generate (count - 1) random numbers between 0 and 100
  const numbers = Array.from({ length: count - 1 }, () => Math.random());

  // Add 0 and 1 to the array and sort it
  numbers.push(0, 1);
  numbers.sort((a, b) => a - b);

  // Calculate the differences between successive numbers and multiply by 100
  const result = [];
  for (let i = 1; i < numbers.length; i++) {
    result.push(Math.round((numbers[i] - numbers[i - 1]) * 100));
  }
  k;
  return result;
}

export function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
