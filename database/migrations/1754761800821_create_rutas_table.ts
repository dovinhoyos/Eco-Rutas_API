import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rutas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_usuario').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.jsonb('origen').notNullable()
      table.jsonb('destino').notNullable()
      table
        .enu('medio_transporte', ['bicicleta', 'caminando', 'transporte_publico'], {
          useNative: true,
          enumName: 'medios_transporte',
        })
        .notNullable()
      table.decimal('distancia_km', 6, 2).notNullable()
      table.integer('duracion_min').notNullable()
      table.decimal('co2_ahorrado_kg', 8, 3).notNullable()

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
