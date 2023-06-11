import { useTranslation } from 'react-i18next';

export default function useSelectLanguage() {
  const { i18n } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const currentLanguage = i18n?.language || 'en';
  const changeLanguage = (value: string) => {
    if (currentLanguage !== value) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      i18n.changeLanguage(value);
    }
  };

  return { changeLanguage, currentLanguage };
}
