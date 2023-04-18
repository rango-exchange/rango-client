import { useTranslation } from 'react-i18next';

export default function useSelectLanguage() {
  const { i18n } = useTranslation();
  // @ts-ignore
  const currentLanguage = i18n?.language || 'en';
  const changeLanguage = (value: string) => {
    if (currentLanguage !== value) {
      // @ts-ignore
      i18n.changeLanguage(value);
    }
  };

  return { changeLanguage, currentLanguage };
}
