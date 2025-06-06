import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { LoginGuard } from './login.guard'
import { Issuer } from 'openid-client'

@Controller()
export class AuthController {
    @UseGuards(LoginGuard)
    @Get('/login')
    login() {}

    @Get('/user')
    user(@Request() req) {
        return req.user
    }

    @UseGuards(LoginGuard)
    @Get('/callback')
    loginCallback(@Res() res: Response) {
        res.redirect(
            process.env
                .OAUTH2_CLIENT_REGISTRATION_LOGIN_POST_LOGOUT_REDIRECT_URI ??
                '/'
        )
    }

    @Get('/logout')
    async logout(@Request() req, @Res() res: Response) {
        const id_token = req.user ? req.user.id_token : undefined

        await req.logout(function (err) {
            req.session.destroy(async (error: any) => {
                const TrustIssuer = await Issuer.discover(
                    `${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/.well-known/openid-configuration`
                )
                const end_session_endpoint =
                    TrustIssuer.metadata.end_session_endpoint

                if (end_session_endpoint && id_token) {
                    res.redirect(
                        `${end_session_endpoint}?post_logout_redirect_uri=${process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_POST_LOGOUT_REDIRECT_URI}${id_token ? '&id_token_hint=' + id_token : ''}`
                    )
                } else {
                    res.redirect(
                        process.env
                            .OAUTH2_CLIENT_REGISTRATION_LOGIN_POST_LOGOUT_REDIRECT_URI ??
                            '/'
                    )
                }
            })
        })
    }
}
