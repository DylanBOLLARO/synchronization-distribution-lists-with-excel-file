import AuthProvider from '@/components/auth-context'
import './globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`antialiased container mx-auto min-h-screen mt-10`}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
