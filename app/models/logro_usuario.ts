import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LogroUsuario extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUsuario: number

  @column()
  declare idLogro: number

  @column.dateTime()
  declare fechaObtenido: DateTime
}
