import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logro_usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_usuario').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('id_logro').unsigned().references('id').inTable('logros').onDelete('CASCADE')

      table.timestamp('fecha_obtenido').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
