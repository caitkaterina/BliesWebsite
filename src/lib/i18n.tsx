import { CATALOG } from '../locales'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Locale = 'en' | 'fr' | 'ar'
export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'fr', label: 'FR', native: 'Français' },
  { code: 'ar', label: 'AR', native: 'العربية' },
]

type Dict = Record<string, string>

// Short chrome strings use keyed dictionaries below; page copy uses tr(englishText) with catalogs in src/locales.
const en: Dict = {
  "nav.home": "Home",
  "nav.enquiry": "Shipment Enquiry",
  "nav.network": "Global Network",
  "nav.aboutblies": "About BLIES",
  "nav.contactus": "Contact Us",
  "nav.more": "Company",
  "nav.getintouch": "Get in touch",
  'nav.procurement': 'Procurement',
  'nav.logistics': 'Logistics',
  'nav.services': 'Services',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.track': 'Track',
  'nav.industries': 'Industries',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',
  'cta.quote': 'Request a Quote',
  'cta.services': 'Explore Our Services',
  'cta.call': 'Call',
  'cta.track': 'Track',
  'cta.learn': 'Learn more',
  'cta.skip': 'Skip to content',
  'hero.eyebrow': 'Procurement & logistics · Est. 2012',
  'hero.title1': 'The supply chain,',
  'hero.title2': 'handled.',
  'hero.body':
    'Integrated procurement and logistics solutions connecting Africa to global markets. One team sources, inspects, documents, clears and moves your goods.',
  'hero.enquiry.title': 'Shipment enquiry',
  'hero.enquiry.badge': 'Our team replies with an update',
  'hero.enquiry.ref': 'Reference or PO number (optional)',
  'hero.enquiry.submit': 'Submit an enquiry',
  'hero.enquiry.note': 'Send your shipment reference and we will reply by email or phone.',
  'journey.source': 'Source',
  'journey.procure': 'Procure',
  'journey.inspect': 'Inspect',
  'journey.document': 'Document',
  'journey.clear': 'Clear',
  'journey.move': 'Move',
  'journey.deliver': 'Deliver',
  'quote.band.title': 'Your quote, without the wait.',
  'quote.band.turnaround': 'Target quotation turnaround: 72 hours to 5 business days, excluding weekends.',
  'quote.band.disclaimer':
    'Subject to complete specifications, supplier availability, cargo requirements and other relevant factors.',
  'footer.tagline': 'The supply chain, handled.',
  'footer.sub': 'Integrated procurement and logistics solutions connecting Africa to global markets.',
  'footer.procurement': 'Procurement',
  'footer.logistics': 'Logistics',
  'footer.company': 'Company & support',
  'footer.offices': 'Offices',
  'footer.legal': 'Legal',
  'footer.rights': '© 2026 BLIES (Pty) Ltd. All rights reserved.',
  'office.za': 'South Africa — Johannesburg',
  'office.uae': 'United Arab Emirates — Dubai',
  'office.ga': 'Gabon',
  'future.label': 'Future development',
  'owned.label': 'Owned road fleet',
  'partner.label': 'Partner-coordinated',
  'meta.description': 'BLIES (Pty) Ltd: procurement, global sourcing and logistics. Offices in South Africa, the United Arab Emirates and Gabon.',
  'lang.label': 'Language',
}

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.enquiry": "Demande d'expédition",
  "nav.network": "Réseau mondial",
  "nav.aboutblies": "À propos de BLIES",
  "nav.contactus": "Nous contacter",
  "nav.more": "Entreprise",
  "nav.getintouch": "Nous joindre",
  'nav.procurement': 'Approvisionnement',
  'nav.logistics': 'Logistique',
  'nav.services': 'Services',
  'nav.about': 'À propos',
  'nav.contact': 'Contact',
  'nav.track': 'Suivi',
  'nav.industries': 'Secteurs',
  'nav.menu': 'Menu',
  'nav.close': 'Fermer le menu',
  'cta.quote': 'Demander un devis',
  'cta.services': 'Découvrir nos services',
  'cta.call': 'Appeler',
  'cta.track': 'Suivi',
  'cta.learn': 'En savoir plus',
  'cta.skip': 'Aller au contenu',
  'hero.eyebrow': 'Approvisionnement & logistique · Depuis 2012',
  'hero.title1': 'La chaîne logistique,',
  'hero.title2': 'maîtrisée.',
  'hero.body':
    "Des solutions intégrées d'approvisionnement et de logistique qui relient l'Afrique aux marchés mondiaux. Une seule équipe sélectionne, contrôle, documente, dédouane et transporte vos marchandises.",
  'hero.enquiry.title': "Demande d'expédition",
  'hero.enquiry.badge': 'Notre équipe vous répond avec une mise à jour',
  'hero.enquiry.ref': 'Référence ou n° de commande (facultatif)',
  'hero.enquiry.submit': 'Envoyer une demande',
  'hero.enquiry.note': "Envoyez votre référence d'expédition et nous vous répondrons par e-mail ou par téléphone.",
  'journey.source': 'Identifier',
  'journey.procure': 'Acheter',
  'journey.inspect': 'Contrôler',
  'journey.document': 'Documenter',
  'journey.clear': 'Dédouaner',
  'journey.move': 'Transporter',
  'journey.deliver': 'Livrer',
  'quote.band.title': 'Votre devis, sans attendre.',
  'quote.band.turnaround': 'Délai cible de devis : de 72 heures à 5 jours ouvrables, week-ends exclus.',
  'quote.band.disclaimer':
    "Sous réserve de spécifications complètes, de la disponibilité des fournisseurs, des exigences relatives à la marchandise et d'autres facteurs pertinents.",
  'footer.tagline': 'La chaîne logistique, maîtrisée.',
  'footer.sub': "Des solutions intégrées d'approvisionnement et de logistique reliant l'Afrique aux marchés mondiaux.",
  'footer.procurement': 'Approvisionnement',
  'footer.logistics': 'Logistique',
  'footer.company': 'Entreprise et assistance',
  'footer.offices': 'Bureaux',
  'footer.legal': 'Mentions légales',
  'footer.rights': '© 2026 BLIES (Pty) Ltd. Tous droits réservés.',
  'office.za': 'Afrique du Sud — Johannesburg',
  'office.uae': 'Émirats arabes unis — Dubaï',
  'office.ga': 'Gabon',
  'future.label': 'Développement futur',
  'owned.label': 'Flotte routière détenue en propre',
  'partner.label': 'Coordonné par des partenaires',
  'meta.description': 'BLIES (Pty) Ltd : approvisionnement, sourcing international et logistique. Bureaux en Afrique du Sud, aux Émirats arabes unis et au Gabon.',
  'lang.label': 'Langue',
}

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.enquiry": "استفسار عن شحنة",
  "nav.network": "الشبكة العالمية",
  "nav.aboutblies": "عن BLIES",
  "nav.contactus": "اتصل بنا",
  "nav.more": "الشركة",
  "nav.getintouch": "تواصل معنا",
  'nav.procurement': 'المشتريات',
  'nav.logistics': 'الخدمات اللوجستية',
  'nav.services': 'الخدمات',
  'nav.about': 'من نحن',
  'nav.contact': 'التواصل',
  'nav.track': 'التتبع',
  'nav.industries': 'القطاعات',
  'nav.menu': 'القائمة',
  'nav.close': 'إغلاق القائمة',
  'cta.quote': 'اطلب عرض سعر',
  'cta.services': 'استكشف خدماتنا',
  'cta.call': 'اتصل',
  'cta.track': 'تتبع',
  'cta.learn': 'اعرف المزيد',
  'cta.skip': 'انتقل إلى المحتوى',
  'hero.eyebrow': 'المشتريات والخدمات اللوجستية · منذ 2012',
  'hero.title1': 'سلسلة الإمداد،',
  'hero.title2': 'بين أيدٍ أمينة.',
  'hero.body':
    'حلول متكاملة للمشتريات والخدمات اللوجستية تربط أفريقيا بالأسواق العالمية. فريق واحد يتولى التوريد والفحص والتوثيق والتخليص ونقل بضائعك.',
  'hero.enquiry.title': 'استفسار عن شحنة',
  'hero.enquiry.badge': 'يردّ فريقنا بتحديث',
  'hero.enquiry.ref': 'المرجع أو رقم أمر الشراء (اختياري)',
  'hero.enquiry.submit': 'أرسل استفساراً',
  'hero.enquiry.note': 'أرسل مرجع شحنتك وسنردّ عليك عبر البريد الإلكتروني أو الهاتف.',
  'journey.source': 'التوريد',
  'journey.procure': 'الشراء',
  'journey.inspect': 'الفحص',
  'journey.document': 'التوثيق',
  'journey.clear': 'التخليص',
  'journey.move': 'النقل',
  'journey.deliver': 'التسليم',
  'quote.band.title': 'عرض سعرك، دون انتظار.',
  'quote.band.turnaround': 'المدة المستهدفة لعرض السعر: من 72 ساعة إلى 5 أيام عمل، باستثناء عطلات نهاية الأسبوع.',
  'quote.band.disclaimer': 'رهناً باكتمال المواصفات وتوافر الموردين ومتطلبات البضائع وعوامل أخرى ذات صلة.',
  'footer.tagline': 'سلسلة الإمداد، بين أيدٍ أمينة.',
  'footer.sub': 'حلول متكاملة للمشتريات والخدمات اللوجستية تربط أفريقيا بالأسواق العالمية.',
  'footer.procurement': 'المشتريات',
  'footer.logistics': 'الخدمات اللوجستية',
  'footer.company': 'الشركة والدعم',
  'footer.offices': 'المكاتب',
  'footer.legal': 'الشؤون القانونية',
  'footer.rights': '© 2026 BLIES (Pty) Ltd. جميع الحقوق محفوظة.',
  'office.za': 'جنوب أفريقيا — جوهانسبرغ',
  'office.uae': 'الإمارات العربية المتحدة — دبي',
  'office.ga': 'الغابون',
  'future.label': 'تطوير مستقبلي',
  'owned.label': 'أسطول نقل بري مملوك',
  'partner.label': 'بتنسيق مع الشركاء',
  'meta.description': 'BLIES (Pty) Ltd: المشتريات والتوريد العالمي والخدمات اللوجستية. مكاتب في جنوب أفريقيا والإمارات العربية المتحدة والغابون.',
  'lang.label': 'اللغة',
}

const dicts: Record<Locale, Dict> = { en, fr, ar }

interface Ctx {
  locale: Locale
  dir: 'ltr' | 'rtl'
  t: (key: string) => string
  tr: (text: string, ...args: (string | number)[]) => string
}

declare global {
  interface Window {
    __i18nMissing?: Record<string, string[]>
  }
}

function makeTr(locale: Locale) {
  return (text: string, ...args: (string | number)[]) => {
    let out = text
    if (locale !== 'en') {
      const hit = CATALOG[locale][text]
      if (hit === undefined) {
        const m = (window.__i18nMissing ??= {})
        const list = (m[locale] ??= [])
        if (!list.includes(text)) list.push(text)
      } else out = hit
    }
    return args.length ? out.replace(/\{(\d+)\}/g, (_, i) => String(args[Number(i)] ?? '')) : out
  }
}
const LocaleCtx = createContext<Ctx>({ locale: 'en', dir: 'ltr', t: (k) => en[k] ?? k, tr: makeTr('en') })

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t: (k) => dicts[locale][k] ?? en[k] ?? k,
      tr: makeTr(locale),
    }),
    [locale],
  )
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = value.dir
  }, [locale, value.dir])
  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>
}

export const useLocale = () => useContext(LocaleCtx)

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  )
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return reduced
}
