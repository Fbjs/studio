'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import type { Locale } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

interface LanguageContextType {
  locale: string;
  translations: Record<string, any>;
  changeLanguage: (newLocale: string) => void;
  dateLocale: Locale;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  isLoadingTranslations: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const defaultLocale = 'en';
const supportedLocalesConfig: Record<string, { locale: Locale, name: string }> = {
  en: { locale: enUS, name: 'English' },
  es: { locale: es, name: 'Spanish' },
};

const getNestedValue = (obj: any, path: string): string | undefined => {
  if (!obj || !path) return undefined;
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  if (typeof current === 'object' && current !== null) {
    return undefined; 
  }
  return String(current);
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('locale');
      if (storedLocale && supportedLocalesConfig[storedLocale]) {
        return storedLocale;
      }
    }
    return defaultLocale;
  });
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  useEffect(() => {
    async function loadAndSetTranslations(localeToLoad: string) {
      setIsLoadingTranslations(true);
      let finalLocale = localeToLoad;
      let loadedTranslations = {};
      try {
        const langModule = await import(`@/locales/${localeToLoad}.json`);
        loadedTranslations = langModule.default;
      } catch (error) {
        console.error(`Failed to load translations for ${localeToLoad}:`, error);
        if (localeToLoad !== defaultLocale) {
          finalLocale = defaultLocale; 
          try {
            const defaultLangModule = await import(`@/locales/${defaultLocale}.json`);
            loadedTranslations = defaultLangModule.default;
            console.warn(`Fell back to ${defaultLocale} translations.`);
          } catch (fallbackError) {
            console.error(`Failed to load fallback ${defaultLocale} translations:`, fallbackError);
          }
        }
      }
      
      setTranslations(loadedTranslations);
      // Only update currentLocale state if it needs to change (e.g. due to fallback)
      // This prevents an extra re-render if localeToLoad was already the target.
      if (currentLocale !== finalLocale) {
        setCurrentLocale(finalLocale);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', finalLocale);
        document.documentElement.lang = finalLocale;
      }
      setIsLoadingTranslations(false);
    }

    loadAndSetTranslations(currentLocale);
  }, [currentLocale]);

  const changeLanguage = useCallback((newLocale: string) => {
    if (supportedLocalesConfig[newLocale] && newLocale !== currentLocale) {
      setCurrentLocale(newLocale); 
    } else if (!supportedLocalesConfig[newLocale]) {
      console.warn(`Unsupported locale: ${newLocale}.`);
    }
  }, [currentLocale]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    if (isLoadingTranslations && Object.keys(translations).length === 0) {
        return key; 
    }
    
    let translation = getNestedValue(translations, key);
    if (translation === undefined) {
      return key;
    }
    if (replacements) {
      Object.keys(replacements).forEach((placeholder) => {
        translation = (translation as string).replace(new RegExp(`{${placeholder}}`, 'g'), String(replacements[placeholder]));
      });
    }
    return translation as string;
  }, [translations, isLoadingTranslations, currentLocale]);

  const dateLocale = supportedLocalesConfig[currentLocale]?.locale || supportedLocalesConfig[defaultLocale].locale;

  const contextValue: LanguageContextType = {
    locale: currentLocale,
    translations,
    changeLanguage,
    dateLocale,
    t,
    isLoadingTranslations,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}