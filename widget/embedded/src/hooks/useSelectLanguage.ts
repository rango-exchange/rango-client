import { useTranslation } from 'react-i18next';

export default function useSelectLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n?.language || 'en';
console.log("?????????",currentLanguage);

  const changeLanguage = (value: string) => {
    if (currentLanguage !== value) {
      i18n.changeLanguage(value);
    }
  };

  return { changeLanguage, currentLanguage };
}
