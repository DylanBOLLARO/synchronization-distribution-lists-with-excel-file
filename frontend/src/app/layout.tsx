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
                <div className="flex-1">
                    <Providers>{children}</Providers>
                </div>
                <code>
                    <pre className="py-10 text-base-content/50">
                        version:a.1.0
                    </pre>
                </code>
            </body>
        </html>
    )
}
