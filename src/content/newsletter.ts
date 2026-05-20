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
  formTitle: "Follow the First Edition",
  formDescription:
    "Join the early signal and receive Sumerian Edition development updates.",
  helperText:
    "We are preparing the final dispatch system. Submit your email now to preview the flow and be first in line when live updates begin.",
  emailLabel: "Email address",
  consentLabel: "I agree to receive First Edition product updates by email.",
  submitLabel: "Notify me",
  consentText:
    "By subscribing, you agree to receive product updates related to Elemental Queens.",
  successMessage: "You are now on the First Edition watchlist.",
  errorMessage: "Subscription is temporarily unavailable. Please try again.",
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
