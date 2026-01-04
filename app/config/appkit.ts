import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { PROPOSAL_CHAIN } from "~/constants/proposalConstants";

export const networks = [PROPOSAL_CHAIN] as [AppKitNetwork, ...AppKitNetwork[]];

// note: hardcoding projectId for now as i had problems with accessing
//  env variable value in here
export const projectId = "97c8a94aaca8161de8773d66a5cafc17";
if (!projectId) {
  throw new Error("reown projectId is not set");
}

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig

export type WagmiConfig = typeof wagmiConfig
