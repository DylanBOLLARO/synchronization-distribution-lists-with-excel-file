import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { buildOpenIdClient, OidcStrategy } from './oidc.strategy'
import { SessionSerializer } from './session.serializer'
import { PassportModule } from '@nestjs/passport'

const OidcStrategyFactory = {
    provide: 'OidcStrategy',
    useFactory: async () => {
        const client = await buildOpenIdClient() // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
        const strategy = new OidcStrategy(client)
        return strategy
    },
}

@Module({
    imports: [
        PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
    ],
    controllers: [AuthController],
    providers: [OidcStrategyFactory, SessionSerializer],
})
export class AuthModule {}
