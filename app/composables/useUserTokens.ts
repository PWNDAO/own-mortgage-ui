import { useQuery } from "@tanstack/vue-query"
import USER_TOKENS from "~/mocks/userTokens"

// TODO remove?
// TODO should we pass user address as arg?
export const useUserTokens = () => {
    const { data: tokens } = useQuery({
        queryKey: ['user-tokens'],
        queryFn: () => {
            // TODO fetch tokens from backend
            return USER_TOKENS ?? []
        }
    })

    return { tokens }
}