"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import ne from "../locales/ne.json";

const dictionaries: Record<string, any> = { en, ne };

type I18nContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("app-lang");
    if (savedLang && dictionaries[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLang = (newLang: string) => {
    if (dictionaries[newLang]) {
      setLang(newLang);
      localStorage.setItem("app-lang", newLang);
    }
  };

  const t = (key: string): string => {
    return dictionaries[lang]?.[key] || dictionaries["en"]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
