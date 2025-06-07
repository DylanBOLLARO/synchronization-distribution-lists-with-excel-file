import SynchronizationProvider from '@/components/providers/synchronization-context'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <SynchronizationProvider>{children}</SynchronizationProvider>
}
