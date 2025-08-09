import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany, HasOne } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import Ruta from '#models/ruta'
import Logro from '#models/logro'
import Ranking from '#models/ranking'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare apellido: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare avatarUrl: string | null

  @column()
  declare puntos: number

  @column()
  declare nivelActividad: number

  @column()
  declare rol: 'usuario' | 'admin'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Ruta)
  declare rutas: HasMany<typeof Ruta>

  @manyToMany(() => Logro, {
    pivotTable: 'logro_usuarios',
    pivotColumns: ['fecha_obtenido'],
  })
  declare logros: ManyToMany<typeof Logro>

  @hasOne(() => Ranking)
  declare ranking: HasOne<typeof Ranking>

  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
