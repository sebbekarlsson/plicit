export const isFloat = (x: any): x is number =>
  typeof x === "number" && x.toString().includes(".");

export const isVowel = (char: string): boolean => {
  char = char.toLowerCase();
  const vowels = ["a", "e", "i", "o", "u"];
  return vowels.includes(char);
};

export const isConsonant = (char: string): boolean => {
  return !isVowel(char);
}
