export interface NewsletterValidationMessages {
  requiredEmail: string;
  invalidEmail: string;
}

export interface NewsletterProviderPlaceholders {
  providerName: string;
  endpoint: string;
  listId: string;
}

export interface NewsletterContent {
  formTitle: string;
  formDescription: string;
  helperText: string;
  emailLabel: string;
  consentLabel: string;
  submitLabel: string;
  consentText: string;
  successMessage: string;
  errorMessage: string;
  validation: NewsletterValidationMessages;
  provider: NewsletterProviderPlaceholders;
}

export const newsletterContent: NewsletterContent = {
  formTitle: "Answer the Call",
  formDescription:
    "The cards are descending. The Queens are watching. Enter your email to receive Sumerian Edition development updates, first-access news, and the signal when the first reliquary opens.",
  helperText:
    "No spam. No prophecy. Just the signal when the trial begins.",
  emailLabel: "Your sigil (email)",
  consentLabel: "I accept the invitation and consent to receive First Edition updates.",
  submitLabel: "Accept the Trial",
  consentText:
    "By subscribing, you agree to receive product updates related to Elemental Queens: Sumerian Edition.",
  successMessage: "The Queens have heard your answer. You are now on the First Edition watchlist.",
  errorMessage: "The signal could not be sent. Please try again.",
  validation: {
    requiredEmail: "Email is required.",
    invalidEmail: "Please enter a valid email address.",
  },
  provider: {
    providerName: "TBD",
    endpoint: "TBD",
    listId: "TBD",
  },
};
