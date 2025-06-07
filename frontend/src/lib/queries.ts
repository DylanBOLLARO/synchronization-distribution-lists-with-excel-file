import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCurrentSynchronization } from './queries-functions'

export function useCurrentSynchronization(enabled: boolean) {
    return useQuery({
        queryKey: ['useCurrentSynchronization'],
        queryFn: async () => await getCurrentSynchronization(),
        refetchInterval: 2000,
        placeholderData: keepPreviousData,
        enabled,
    })
}
