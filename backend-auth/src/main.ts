// src : https://sdoxsee.github.io/blog/2020/02/05/cats-nest-nestjs-mongo-oidc.html

import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import * as passport from 'passport'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.use(cookieParser())

    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH'],
    })

    // Authentication & Session
    app.use(
        session({
            secret: process.env.SESSION_SECRET ?? '', // to sign session id
            resave: false, // will default to false in near future: https://github.com/expressjs/session#resave
            saveUninitialized: false, // will default to false in near future: https://github.com/expressjs/session#saveuninitialized
            rolling: true, // keep session alive
            cookie: {
                maxAge: 30 * 60 * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
                httpOnly: true, // so that cookie can't be accessed via client-side script
            },
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(process.env.PORT ?? 3001)
    console.log(`Application running at ${await app.getUrl()}`)
}
void bootstrap()
