import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia, type AppKitNetwork } from "@reown/appkit/networks";

export const networks = [sepolia] as [AppKitNetwork, ...AppKitNetwork[]];

// TODO how to resolve this? does it harm anything to have it here in the code?
//  i think it's visible in the network requests anyway, right?
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
