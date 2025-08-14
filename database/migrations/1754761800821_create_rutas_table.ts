import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rutas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('id_usuario')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table.enum('medio_transporte', ['bicicleta', 'caminando', 'transporte_publico']).notNullable()

      table.specificType('origen', 'decimal[]').notNullable()
      table.specificType('destino', 'decimal[]').notNullable()

      table.decimal('distancia_km', 8, 3).nullable().defaultTo(0)
      table.integer('duracion_min').nullable().defaultTo(0)
      table.decimal('co2_ahorrado_kg', 8, 3).nullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
