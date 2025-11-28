interface ValidatableFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  city: string;
  state: string;
  age?: string;
  gender?: string;
  preferences: string[];
  termsAccepted: boolean;
}

export const validateStep = (step: number, formData: ValidatableFormData): boolean => {
  switch (step) {
    case 1:
      return (
        formData.email.includes('@') &&
        formData.password.length >= 6 &&
        formData.password === formData.confirmPassword
      );
    case 2:
      return (
        formData.name.length > 0 &&
        formData.city.length > 0 &&
        formData.state.length === 2 &&
        (!formData.age || formData.age.length > 0) &&
        (!formData.gender || formData.gender.length > 0)
      );
    case 3:
      return formData.preferences.length > 0;
    case 4:
      return formData.termsAccepted;
    default:
      return true;
  }
};
