import {Platform, NativeModules} from 'react-native';

export const DEFAULT_LOCALE = 'en';

export const PREFERRED_LOCALE = getPreferredLocale();

function getPreferredLocale(): string {
  let locale;
  if (Platform.OS === 'ios') {
    locale =
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
      NativeModules.SettingsManager?.settings?.AppleLocale;
  } else {
    locale = NativeModules.I18nManager.localeIdentifier;
  }

  if (!locale) {
    locale = 'en-US';
  }
  locale = locale.replace(/_/g, '-');
  if (locale.startsWith('en-')) {
    locale = 'en';
  }
  if (locale.startsWith('ar-')) {
    locale = 'ar';
  }
  if (locale.startsWith('fa-')) {
    locale = 'fa';
  }
  return locale;
}

declare global {
  interface String {
    capitalizeFirstLetter(): string;
  }
}

// Implement the function
String.prototype.capitalizeFirstLetter = function (this: string): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
