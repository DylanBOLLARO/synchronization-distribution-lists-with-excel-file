import AuthProvider from '@/components/auth-context'
import { Header } from '@/components/header'
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
                <AuthProvider>
                    <div className="flex flex-col gap-3">
                        <Header />
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
