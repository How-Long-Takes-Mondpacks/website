import { json as en_us } from '@/types/translations/en_us'

type translations = typeof en_us

declare module './lib/i18n/register' {
  export interface Register {
    translations: translations
  }
}