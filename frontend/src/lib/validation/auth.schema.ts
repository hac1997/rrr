export const isValidEmail = (email: string): boolean =>
  email.includes('@') && email.length > 3;

export const isValidPassword = (password: string): boolean =>
  password.length >= 6;

export const isValidName = (name: string): boolean =>
  name.trim().length > 0;

export const isValidCity = (city: string): boolean =>
  city.trim().length > 0;

export const isValidState = (state: string): boolean =>
  state.trim().length === 2;

export const isValidAge = (age: string): boolean =>
  parseInt(age) > 0 && parseInt(age) < 150;

export const isValidGender = (gender: string): boolean =>
  gender.trim().length > 0;

export const hasPreferences = (preferences: string[]): boolean =>
  preferences.length > 0;

export const validateStep = (
  step: number,
  data: {
    email: string;
    password: string;
    name: string;
    city: string;
    state: string;
    age: string;
    gender: string;
    preferences: string[];
    termsAccepted: boolean;
  }
): boolean => {
  switch (step) {
    case 1:
      return isValidEmail(data.email) && isValidPassword(data.password);
    case 2:
      return isValidName(data.name) && isValidCity(data.city) &&
             isValidState(data.state) && isValidAge(data.age) &&
             isValidGender(data.gender);
    case 3:
      return hasPreferences(data.preferences);
    case 4:
      return data.termsAccepted;
    default:
      return true;
  }
};
