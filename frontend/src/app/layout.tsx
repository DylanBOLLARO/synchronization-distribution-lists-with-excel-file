import { Providers } from '@/components/providers'
import './globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`flex flex-col antialiased container mx-auto min-h-screen px-2`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
