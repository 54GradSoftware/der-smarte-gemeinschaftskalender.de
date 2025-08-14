import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'de-DE',
  description: 'Der Smarte Gemeinschaftskalender',

  theme: defaultTheme({
    logo: './DSG-Logo-Dokumentation.png',

    navbar: [
  { text: 'Handbuch', link: '/get-started' },
  { text: 'Kalenderfunktionen', link: '/DSG%20Funktionen/' },
  {
    text: 'Terminmanagement',
    children: [
      { text: 'Organisationsverwaltung', link: '/Terminverwaltung/Organisation/' },
      { text: 'Einzeltermine', link: '/Terminverwaltung/Einzeltermine/' },
      { text: 'Serientermine', link: '/Terminverwaltung/Serientermine/' },
      { text: 'iCal-Dateien', link: '/Terminverwaltung/iCal-Dateien/' },
      { text: 'Kalenderintegration', link: '/Terminverwaltung/Kalenderintegration/' },
      { text: 'Werbemittelgenerator', link: '/Werbemittelgenerator/' }
    ]
  },
  {
    text: 'Entwicklungsbereich',
    children: [
      { text: 'Hosting', link: '/Entwicklungsbereich/Hosting/' },
      { text: 'Repositories', link: '/Entwicklungsbereich/Repositories/' },
      { text: 'Technologien', link: '/Entwicklungsbereich/Technologien/' }
    ]
  }
],

  }),

  bundler: viteBundler(),
})
