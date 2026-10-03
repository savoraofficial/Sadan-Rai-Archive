// ADD-ON: replace placeholders when official contact/payment accounts are ready.
// Keep payment provider secret keys OFF the frontend. Only public checkout URLs belong here.
export const ARCHIVE_ADDON_CONFIG = {
  contactEmail: 'YOUR_OFFICIAL_EMAIL@example.com',
  phone: 'YOUR_OFFICIAL_PHONE_NUMBER',
  support: {
    oneTimeUrl: '',
    supporterUrl: '',
    archiveMemberUrl: '',
    patronUrl: '',
  },
} as const;

export const supportLinkOrContact = (url: string) =>
  url.trim() || '#contact';
