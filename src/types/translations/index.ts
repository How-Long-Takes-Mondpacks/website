import { json as en_us } from './en_us'
import { json as es_es } from './es_es'
import { json as ar_sa } from "./ar_sa"
import { json as fr_fr } from "./fr_fr"
import { json as de_de } from "./de_de"
import { json as ja_jp } from "./ja_jp"
import { json as zh_cn } from "./zh_cn"
import { json as ru_ru } from "./ru_ru"
import { json as pt_br } from "./pt_br"
import { json as it_it } from "./it_it"
import { json as he_il } from "./he_il"
import { json as hi_in } from "./hi_in"
import { json as ko_kr } from "./ko_kr"

export const translations = {
  en_us,
  es_es,
  ko_kr,
  ar_sa,
  fr_fr,
  de_de,
  ja_jp,
  zh_cn,
  ru_ru,
  pt_br,
  it_it,
  he_il,
  hi_in,
}

export const langs = [
  {
    name: 'EN_US',
    value: 'en_us'
  },
  {
    name: 'ES_ES',
    value: 'es_es'
  },
  {
    name: "KO_KR",
    value: "ko_kr",
  },
  {
    name: "AR_SA",
    value: "ar_sa",
  },
  {
    name: "FR_FR",
    value: "fr_fr",
  },
  {
    name: "DE_DE",
    value: "de_de",
  },
  {
    name: "JA_JP",
    value: "ja_jp",
  },
  {
    name: "ZH_CN",
    value: "zh_cn",
  },
  {
    name: "RU_RU",
    value: "ru_ru",
  },
  {
    name: "PT_BR",
    value: "pt_br",
  },
  {
    name: "IT_IT",
    value: "it_it",
  },
  {
    name: "HE_IL",
    value: "he_il",
  },
  {
    name: "HI_IN",
    value: "hi_in",
  }
]

export type LocaleName = keyof typeof translations