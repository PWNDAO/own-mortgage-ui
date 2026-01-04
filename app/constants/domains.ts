export interface DomainMetadata {
  title: string
  description: string
  ogImagePath: string
  keywords?: string
}

export const DEFAULT_METADATA: DomainMetadata = {
  title: 'Fund a Hackerspace - First Ever Pure DeFi Mortgage',
  description: 'Fund the Bordel hackerspace mortgage, get exclusive perks and fixed APR for 5 years.',
  ogImagePath: '/images/parental-advisory-og.png',
  keywords: 'DeFi, mortgage, blockchain, Ethereum, Bordel Hackerspace, crowdfunding, actual DeFi, crypto loan',
}

/**
 * Get the hardcoded metadata.
 * Domain argument is kept for compatibility but ignored.
 */
export function getMetadataForDomain(_hostname?: string): DomainMetadata {
  return DEFAULT_METADATA
}
