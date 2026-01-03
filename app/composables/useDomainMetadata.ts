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
export function useDomainMetadata(): ComputedRef<DomainMetadataResult> {
  const url = useRequestURL()

  return computed(() => {
    const hostname = url.hostname.toLowerCase()
    const origin = url.origin
    const metadata = getMetadataForDomain(hostname)

    return {
      ...metadata,
      ogImage: `${origin}${metadata.ogImagePath}`,
      hostname,
      origin,
    }
  })
}

/**
 * Apply SEO meta tags based on the current domain.
 * Call this in your page's setup to set domain-specific metadata.
 */
export function useDomainSeoMeta(overrides?: Partial<DomainMetadata>) {
  const metadata = useDomainMetadata()
  const url = useRequestURL()

  useSeoMeta({
    title: () => overrides?.title ?? metadata.value.title,
    description: () => overrides?.description ?? metadata.value.description,
    ogTitle: () => overrides?.title ?? metadata.value.title,
    ogDescription: () => overrides?.description ?? metadata.value.description,
    ogImage: () => overrides?.ogImagePath ? `${metadata.value.origin}${overrides.ogImagePath}` : metadata.value.ogImage,
    ogUrl: () => url.href,
    ogType: 'website',
    ogSiteName: () => metadata.value.title,
    twitterCard: 'summary_large_image',
    twitterTitle: () => overrides?.title ?? metadata.value.title,
    twitterDescription: () => overrides?.description ?? metadata.value.description,
    twitterImage: () => overrides?.ogImagePath ? `${metadata.value.origin}${overrides.ogImagePath}` : metadata.value.ogImage,
    themeColor: '#000000',
    robots: 'index, follow',
    author: 'OWN Labs',
    keywords: () => overrides?.keywords ?? metadata.value.keywords,
  })
}
