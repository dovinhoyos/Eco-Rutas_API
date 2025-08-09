import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nombre').notNullable()
      table.string('apellido').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('avatar_url').nullable()
      table.integer('puntos').defaultTo(0)
      table.integer('nivel_actividad').defaultTo(1)
      table
        .enu('rol', ['usuario', 'admin'], { useNative: true, enumName: 'user_roles' })
        .notNullable()
        .defaultTo('usuario')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
