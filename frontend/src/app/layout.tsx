import { Header } from '@/components/header'
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
                className={`antialiased container mx-auto min-h-screen mt-10 mb-96`}
            >
                <Providers>
                    <div className="flex flex-col gap-3">
                        <Header />
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    )
}
