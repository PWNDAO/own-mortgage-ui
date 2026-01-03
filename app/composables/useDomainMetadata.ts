import { getMetadataForDomain, type DomainMetadata } from '~/constants/domains'

export interface DomainMetadataResult extends DomainMetadata {
  /** Full URL to the OG image (includes origin) */
  ogImage: string
  /** The detected hostname */
  hostname: string
  /** The full origin (protocol + host) */
  origin: string
}

/**
 * Composable that returns metadata based on the current request domain.
 * Works on both server (SSR) and client side using `useRequestURL()`.
 */
export function useDomainMetadata() {
  const url = useRequestURL()
  const hostname = url.hostname.toLowerCase()
  const origin = url.origin
  const metadata = getMetadataForDomain(hostname)

  return {
    ...metadata,
    ogImage: `${origin}${metadata.ogImagePath}`,
    hostname,
    origin,
  }
}

/**
 * Apply SEO meta tags based on the current domain.
 * Call this in your page's setup to set domain-specific metadata.
 */
export function useDomainSeoMeta(overrides?: Partial<DomainMetadata>) {
  const metadata = useDomainMetadata()
  const url = useRequestURL()

  const title = overrides?.title ?? metadata.title
  const description = overrides?.description ?? metadata.description
  const ogImage = overrides?.ogImagePath ? `${metadata.origin}${overrides.ogImagePath}` : metadata.ogImage
  const keywords = overrides?.keywords ?? metadata.keywords

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: url.href,
    ogType: 'website',
    ogSiteName: title,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    themeColor: '#000000',
    robots: 'index, follow',
    author: 'OWN Labs',
    keywords,
  })
}
