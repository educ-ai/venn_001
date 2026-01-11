export function filterCorporationNumberInput(text: string): string {
  // Only allow digits, max 9 characters
  return text.replace(/\D/g, '').slice(0, 9);
}
