import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/usuario'

export default class Ranking extends BaseModel {
  @column()
  declare idUsuario: number

  @column()
  declare puntosTotales: number

  @column()
  declare posicion: number

  @column()
  declare totalKm: number

  @column()
  declare rutasTotales: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>
}
