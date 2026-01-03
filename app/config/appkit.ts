import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { PROPOSAL_CHAIN } from "~/constants/proposalConstants";

export const networks = [PROPOSAL_CHAIN] as [AppKitNetwork, ...AppKitNetwork[]];

// note: hardcoding projectId for now as i had problems with accessing
//  env variable value in here
export const projectId = "97c8a94aaca8161de8773d66a5cafc17";

// Lazy-initialized adapter - only created when actually accessed on client-side
// This prevents async operations (fetch/connect) from running in global scope,
// which Cloudflare Workers prohibits.
let _wagmiAdapter: WagmiAdapter | null = null;

export function getWagmiAdapter() {
  if (!_wagmiAdapter) {
    if (!projectId) {
      throw new Error("reown projectId is not set");
    }
    _wagmiAdapter = new WagmiAdapter({
      ssr: true,
      networks,
      projectId,
    });
  }
  return _wagmiAdapter;
}

// Getter for wagmiConfig that lazily creates the adapter
export function getWagmiConfig() {
  return getWagmiAdapter().wagmiConfig;
}

export type WagmiConfig = ReturnType<typeof getWagmiConfig>;
