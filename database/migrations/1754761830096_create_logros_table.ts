import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logros'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nombre', 100).notNullable()
      table.text('descripcion').nullable()
      table.string('icono_url', 255).nullable()
      table.integer('puntos').defaultTo(0)
      table.jsonb('condicion').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
