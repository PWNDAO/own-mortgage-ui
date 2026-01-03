export interface DomainMetadata {
  title: string
  description: string
  ogImagePath: string
  keywords?: string
}

export const DEFAULT_METADATA: DomainMetadata = {
  title: 'First Ever Pure DeFi Mortgage - Funding a Hackerspace',
  description: 'Fund this community mortgage, get exclusive perks, a fixed APR for 5 years and become part of onchain history.',
  ogImagePath: '/images/thumbnail.png',
  keywords: 'DeFi, mortgage, blockchain, Ethereum, crowdfunding, decentralized finance, crypto loan, weETH, USDC',
}

/**
 * Domain-specific metadata overrides.
 * Keys are matched against the hostname (case-insensitive, supports partial match).
 */
export const DOMAIN_METADATA: Record<string, DomainMetadata> = {
  'loan.bordel.wtf': {
    title: 'Fund a Hackerspace - First Ever Pure DeFi Mortgage',
    description: 'Fund the Bordel hackerspace mortgage, get exclusive perks and fixed APR for 5 years.',
    ogImagePath: '/images/parental-advisory-og.png',
    keywords: 'DeFi, mortgage, blockchain, Ethereum, Bordel Hackerspace, crowdfunding, actual DeFi, crypto loan',
  }
}

/**
 * Find metadata for a given hostname.
 * Matches partial hostname (e.g., 'loan.bordel.wtf' matches 'loan.bordel.wtf:3000').
 */
export function getMetadataForDomain(hostname: string): DomainMetadata {
  const lowerHostname = hostname.toLowerCase()
  
  for (const [domain, metadata] of Object.entries(DOMAIN_METADATA)) {
    if (lowerHostname.includes(domain)) {
      return metadata
    }
  }
  
  return DEFAULT_METADATA
}
