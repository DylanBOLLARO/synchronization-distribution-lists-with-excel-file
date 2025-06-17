import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    basePath: process.env.NODE_ENV === 'production' ? '/toolbox' : '',
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
                      permanent: true,
                  },
                  {
                      source: '/callback',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/callback`,
                      permanent: true,
                  },
                  {
                      source: '/user',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/user`,
                      permanent: true,
                  },
                  {
                      source: '/logout',
                      destination: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/logout`,
                      permanent: true,
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
