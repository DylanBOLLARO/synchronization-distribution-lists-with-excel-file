import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTodos } from './queries-functions'

export function useCurrentSynchronization(conf: any) {
    return useQuery({
        queryKey: ['todos'],
        // TODO rename function
        queryFn: async () => await getTodos(),
        refetchInterval: 2000,
        placeholderData: keepPreviousData,
        enabled: conf.enable,
    })
}
