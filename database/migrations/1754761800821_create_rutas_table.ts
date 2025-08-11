import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rutas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('id_usuario')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')
      table.enum('medio_transporte', ['bicicleta', 'caminando', 'transporte_publico']).notNullable()
      table.string('origen').notNullable()
      table.string('destino').notNullable()
      table.double('distancia_km').notNullable()
      table.double('duracion_min').notNullable()
      table.double('co2_ahorrado_kg').notNullable()
      table.specificType('geom', 'geometry(LineString,4326)').notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
