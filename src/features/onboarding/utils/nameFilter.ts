export const filterNameInput = (text: string): string =>
  text.replace(/[^\p{L}\s'.\-]/gu, '');
