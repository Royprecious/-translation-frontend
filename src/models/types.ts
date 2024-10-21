export type TranslationItem = {
  [languageCode: string]: string;
};

export type TranslationData = {
  [key: string]: TranslationItem;
};