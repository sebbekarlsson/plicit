export const canBeAutoDiffed = (a: any, b: any): boolean => {
  return typeof a !== "object" && typeof b !== "object";
};
