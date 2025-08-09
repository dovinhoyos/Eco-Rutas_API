import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rankings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('id_usuario')
        .unsigned()
        .primary()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('puntos_totales').notNullable()
      table.integer('posicion').notNullable()
      table.decimal('total_km', 8, 2).notNullable()
      table.integer('rutas_totales').notNullable()

      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
