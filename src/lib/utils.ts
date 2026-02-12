export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateTime(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}
