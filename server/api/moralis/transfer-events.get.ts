import { defineEventHandler, getQuery } from 'h3'
import type { MoralisResponse } from '~/typing/moralis'

const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const apiKey = config.moralisApiKey

    if (!apiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Moralis API key is not configured on the server',
        })
    }

    const { vaultAddress, chain, cursor, fromDate } = getQuery(event)

    if (!vaultAddress) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing vaultAddress parameter',
        })
    }

    try {
        return await $fetch<MoralisResponse>(`${MORALIS_BASE_URL}/erc20/${vaultAddress}/transfers`, {
            headers: {
                'accept': 'application/json',
                'X-API-Key': apiKey,
            },
            query: {
                chain: (chain as string) || 'eth',
                order: 'DESC',
                page_size: '100',
                from_date: fromDate as string,
                cursor: cursor as string,
            }
        })
    } catch (error: unknown) {
        console.error('Error proxying to Moralis:', error)
        const fetchError = error as { response?: { status?: number; _data?: { message?: string } }; message?: string }
        throw createError({
            statusCode: fetchError.response?.status || 500,
            statusMessage: fetchError.response?._data?.message || fetchError.message || 'Internal Server Error',
        })
    }
})
