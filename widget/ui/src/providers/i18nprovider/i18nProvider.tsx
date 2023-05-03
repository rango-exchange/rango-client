import { I18nextProvider } from 'react-i18next';
import React from 'react';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    // @ts-ignore
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  );
};

export function useLanguage() {
  const { i18n } = useTranslation();
  // @ts-ignore
  const currentLanguage = i18n?.language || 'en';
  console.log(currentLanguage);

  const changeLanguage = (value: string) => {
    if (currentLanguage !== value) {
      // @ts-ignore
      i18n.changeLanguage(value);
    }
  };
  //@ts-ignore
  return { changeLanguage, currentLanguage, translate: i18n.t };
}
