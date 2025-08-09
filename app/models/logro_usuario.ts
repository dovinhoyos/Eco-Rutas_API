import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Usuario from './usuario.js'
import Logro from './logro.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class LogroUsuario extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUsuario: number

  @column()
  declare idLogro: number

  @column.dateTime()
  declare fechaObtenido: DateTime

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  @belongsTo(() => Logro)
  declare logro: BelongsTo<typeof Logro>
}
