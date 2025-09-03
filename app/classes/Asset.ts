import { formatUnits, type Address } from "viem"
import type { Pool } from "./Pool"

export class Asset {
    constructor(
        public chainId: number | undefined,
        public address: Address | undefined,
        public name: string | undefined,
        public symbol: string | undefined,
        public decimals: number,
    ) {}
}

export class UserAsset extends Asset {
    constructor(
        chainId: number | undefined,
        address: Address | undefined,
        name: string | undefined,
        symbol: string | undefined,
        decimals: number,
        public balance: bigint,
        public pool: Pool | undefined = undefined,
        public apy: number | undefined = undefined,
        public sourceOfFunds: Address | undefined = undefined,
    ) {
        super(chainId, address, name, symbol, decimals)
    }

    get id(): string {
        return `${this.chainId}-${this.address}-${this.pool}-${this.sourceOfFunds}`
    }

    get balanceFormatted(): string {
        return formatUnits(this.balance, this.decimals)
    }
}
