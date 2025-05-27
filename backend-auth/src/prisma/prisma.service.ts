import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        const adapter = new PrismaBetterSQLite3({
            url: 'file:./prisma/dev.db',
        })
        new PrismaClient({ adapter })
    }
}
