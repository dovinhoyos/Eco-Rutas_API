import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'

export default class Ruta extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUsuario: number

  @column()
  declare medioTransporte: 'bicicleta' | 'caminando' | 'transporte_publico'

  @column()
  declare origen: number[] // [lat, lng]

  @column()
  declare destino: number[] // [lat, lng]

  @column()
  declare distanciaKm: number

  @column()
  declare duracionMin: number

  @column({ columnName: 'co2_ahorrado_kg' })
  declare co2AhorradoKg: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>
}
