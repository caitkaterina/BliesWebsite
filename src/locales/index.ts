import type { Locale } from '../lib/i18n'
import * as chrome from './chrome'
import * as home from './home'
import * as company from './company'
import * as procurement from './procurement'
import * as services from './services'
import * as quote from './quote'
import * as integration from './integration'
import * as account from './account'

type Cat = Record<string, string>
const groups = [chrome, home, company, procurement, services, quote, integration, account] as { fr: Cat; ar: Cat }[]

export const CATALOG: Record<'fr' | 'ar', Cat> = {
  fr: Object.assign({}, ...groups.map((g) => g.fr)),
  ar: Object.assign({}, ...groups.map((g) => g.ar)),
}
export type { Locale }
