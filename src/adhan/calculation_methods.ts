import {CalculationMethod, CalculationParameters} from 'adhan';
import {i18n} from '@/i18n';

type CalculationMethodEntry = {
  label: string;
  info: string;
  get: () => CalculationParameters;
};

export const CalculationMethods: Record<string, CalculationMethodEntry> = {
  /**
   * The default value for {@link CalculationParameters#method} when initializing a
   * {@link CalculationParameters} object. Sets a Fajr angle of 0 and an Isha angle of 0.
   */
  Other: {
    label: i18n._('Other'),
    info: 'Sets a Fajr angle of 0 and an Isha angle of 0.' as const,
    get: CalculationMethod.Other,
  },

  MoonsightingCommittee: {
    label: i18n._('Moonsighting Committee'),
    info: 'Uses a Fajr angle of 18 and an Isha angle of 18. Also uses seasonal adjustment values.' as const,
    get: CalculationMethod.MoonsightingCommittee,
  },

  MuslimWorldLeague: {
    label: i18n._('Muslim World League'),
    info: 'Uses Fajr angle of 18 and an Isha angle of 17' as const,
    get: CalculationMethod.MuslimWorldLeague,
  },

  Egyptian: {
    label: i18n._('Egyptian General Authority of Survey'),
    info: 'Uses Fajr angle of 19.5 and an Isha angle of 17.5' as const,
    get: CalculationMethod.Egyptian,
  },

  Karachi: {
    label: i18n._('University of Islamic Sciences, Karachi'),
    info: 'Uses Fajr angle of 18 and an Isha angle of 18' as const,
    get: CalculationMethod.Karachi,
  },

  UmmAlQura: {
    label: i18n._('Umm al-Qura University, Makkah'),
    info: 'Uses a Fajr angle of 18.5 and an Isha interval of 90 minutes.\nNote: You should add a +30 minute custom adjustment of Isha during Ramadan.' as const,
    get: CalculationMethod.UmmAlQura,
  },

  NorthAmerica: {
    label: i18n._('Referred to as the ISNA method'),
    info: 'This method is included for completeness, but is not recommended.\nUses a Fajr angle of 15 and an Isha angle of 15.' as const,
    get: CalculationMethod.NorthAmerica,
  },

  Gulf: {
    label: i18n._('Gulf region'),
    info: 'Modified version of Umm al-Qura that uses a Fajr angle of 19.5.',
    get: () => new CalculationParameters('Other', 19.5, undefined, 90),
  },

  Dubai: {
    label: i18n._('The Gulf Region'),
    info: 'Uses Fajr and Isha angles of 18.2 degrees.',
    get: CalculationMethod.Dubai,
  },

  Kuwait: {
    label: i18n._('Kuwait'),
    info: 'Uses a Fajr angle of 18 and an Isha angle of 17.5',
    get: CalculationMethod.Kuwait,
  },

  Qatar: {
    label: i18n._('Qatar'),
    info: 'Modified version of Umm al-Qura that uses a Fajr angle of 18.',
    get: CalculationMethod.Qatar,
  },

  Singapore: {
    label: i18n._('Singapore'),
    info: 'Uses a Fajr angle of 20 and an Isha angle of 18' as const,
    get: CalculationMethod.Singapore,
  },

  France: {
    label: i18n._('Union Organization Islamic de France'),
    info: 'Uses a Fajr angle of 12 and an Isha angle of 12.',
    get: () => new CalculationParameters('Other', 12.0, 12.0),
  },

  Turkey: {
    label: 'Diyanet İşleri Başkanlığı, Turkey',
    info: 'Uses a Fajr angle of 18 and an Isha angle of 17.',
    get: CalculationMethod.Turkey,
  },

  Russia: {
    label: i18n._('Spiritual Administration of Muslims of Russia'),
    info: 'Uses a Fajr angle of 16 and an Isha angle of 15.',
    get: () => new CalculationParameters('Other', 16.0, 15.0),
  },

  Jafari: {
    label: i18n._('Shia Ithna Ashari, Leva Institute, Qum'),
    info: 'Uses Fajr angle of 16, Maghrib angle of 4 and Isha angle of 14',
    get: () => new CalculationParameters('Other', 16.0, 14.0, 0, 4.0),
  },

  Tehran: {
    label: i18n._('Shia, Institute of Geophysics, University of Tehran'),
    info: 'Uses Fajr angle of 17.7, Maghrib angle of 4.5 and Isha angle of 14',
    get: CalculationMethod.Tehran,
  },
};
