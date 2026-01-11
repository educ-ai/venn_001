import { filterNameInput } from 'features/onboarding/utils/nameFilter';
import { filterPhoneInput } from 'features/onboarding/utils/phoneFilter';
import { filterCorporationNumberInput } from 'features/onboarding/utils/corporationNumberFilter';

describe('filterNameInput', () => {
  it('allows letters', () => {
    expect(filterNameInput('John')).toBe('John');
  });

  it('filters out numbers', () => {
    expect(filterNameInput('John123')).toBe('John');
  });

  it('allows apostrophes', () => {
    expect(filterNameInput("O'Brien")).toBe("O'Brien");
  });

  it('allows hyphens', () => {
    expect(filterNameInput('Mary-Jane')).toBe('Mary-Jane');
  });

  it('allows spaces', () => {
    expect(filterNameInput('John Doe')).toBe('John Doe');
  });

  it('allows Unicode letters', () => {
    expect(filterNameInput('Čéšar')).toBe('Čéšar');
  });

  it('allows periods', () => {
    expect(filterNameInput('Dr. Smith')).toBe('Dr. Smith');
  });
});

describe('filterPhoneInput', () => {
  it('allows valid phone number', () => {
    expect(filterPhoneInput('+13062776103')).toBe('+13062776103');
  });

  it('allows + only at the beginning', () => {
    expect(filterPhoneInput('+1306+2776103')).toBe('+13062776103');
  });

  it('filters out letters', () => {
    expect(filterPhoneInput('+1abc3062776103')).toBe('+13062776103');
  });

  it('filters out special characters except + at start', () => {
    expect(filterPhoneInput('+1-306-277-6103')).toBe('+13062776103');
  });

  it('allows digit as first character', () => {
    expect(filterPhoneInput('13062776103')).toBe('13062776103');
  });

  it('returns empty string for empty input', () => {
    expect(filterPhoneInput('')).toBe('');
  });
});

describe('filterCorporationNumberInput', () => {
  it('allows digits', () => {
    expect(filterCorporationNumberInput('123456789')).toBe('123456789');
  });

  it('filters out non-digit characters', () => {
    expect(filterCorporationNumberInput('12a34b56c789')).toBe('123456789');
  });

  it('limits to 9 characters', () => {
    expect(filterCorporationNumberInput('1234567890123')).toBe('123456789');
  });

  it('filters out special characters', () => {
    expect(filterCorporationNumberInput('123-456-789')).toBe('123456789');
  });
});
