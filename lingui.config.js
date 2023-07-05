/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: [
    'ar',
    'bn',
    'bs',
    'cs',
    'de',
    'en',
    'fa',
    'fr',
    'hi',
    'id',
    'tr',
    'ur',
    'vi',
  ],
  catalogs: [
    {
      path: 'locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
};
