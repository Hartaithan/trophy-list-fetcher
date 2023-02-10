export const isLink = (value: string): boolean => {
  return value.includes("http") || value.includes("psnprofiles");
};
