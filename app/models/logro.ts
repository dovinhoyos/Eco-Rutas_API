import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'
import { DateTime } from 'luxon'

export default class Logro extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

  @column()
  declare puntos: number

  @column()
  declare iconoUrl: string | null

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => (value ? JSON.parse(value) : null),
  })
  declare condicion: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @manyToMany(() => Usuario, {
    pivotTable: 'logro_usuarios',
    pivotColumns: ['fecha_obtenido'],
  })
  declare usuarios: ManyToMany<typeof Usuario>
}
