import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Reporte extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idAdmin: number

  @column()
  declare tipo: string

  @column()
  declare archivoUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'idAdmin',
  })
  declare admin: BelongsTo<typeof User>
}
