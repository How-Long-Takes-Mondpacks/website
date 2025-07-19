export const THEMES = [
  {
    name: 'Dark',
    value: 'dark'
  },
  {
    name: 'Light',
    value: 'light'
  }
] as const

export type Themes = 'dark' | 'light'

export type Theme = (typeof THEMES)[number]