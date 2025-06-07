import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
                search: '',
            },
        ],
    },
    async redirects() {
        return process.env.NODE_ENV === 'production'
            ? [
                  {
                      source: '/login',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/login`,
                      permanent: false,
                  },
                  {
                      source: '/callback',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/callback`,
                      permanent: false,
                  },
                  {
                      source: '/user',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/user`,
                      permanent: false,
                  },
                  {
                      source: '/logout',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/logout`,
                      permanent: false,
                  },
              ]
            : []
    },
    async rewrites() {
        return process.env.NODE_ENV === 'production'
            ? []
            : [
                  {
                      source: '/login',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/login`,
                  },
                  {
                      source: '/callback',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/callback`,
                  },
                  {
                      source: '/user',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/user`,
                  },
                  {
                      source: '/logout',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/logout`,
                  },
              ]
    },
}

export default nextConfig
