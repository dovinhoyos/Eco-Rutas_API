import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

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

  @column()
  declare condicion: any | null

  @manyToMany(() => User, {
    pivotTable: 'logro_usuarios',
    pivotColumns: ['fecha_obtenido'],
  })
  declare usuarios: ManyToMany<typeof User>
}
