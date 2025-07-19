export const siteConfig = {
  name: 'How Long Takes Modpacks',
  url: '',
  ogImage: '',
  description: 'Gives information about how many time takes to complete, partial completes of a minecraft modpack published on curseforge',
  links: {
    twitter: '',
    github: ''
  },
  startYear: 2025,
  currentYear: new Date().getFullYear(),
  cfBaseApi: 'https://api.curseforge.com',
  cfv1: 'https://minecraft.curseforge.com/api/projects',
  cfv2: 'https://api.curseforge.com/v2'
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}