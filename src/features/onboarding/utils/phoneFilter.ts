export function filterPhoneInput(text: string): string {
  // Allow + only at the beginning, then only digits
  if (text.length === 0) {
    return '';
  }

  let result = '';

  // First character can be + or digit
  if (text[0] === '+' || /\d/.test(text[0])) {
    result = text[0];
  }

  // Remaining characters can only be digits
  for (let i = 1; i < text.length; i++) {
    if (/\d/.test(text[i])) {
      result += text[i];
    }
  }

  return result;
}
