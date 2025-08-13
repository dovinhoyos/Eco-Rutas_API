import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Logro from '#models/logro'

export default class LogroSeeder extends BaseSeeder {
  public async run() {
    await Logro.createMany([
      {
        nombre: 'Primer Ruta',
        descripcion: 'Completa tu primera ruta registrada.',
        puntos: 50,
        iconoUrl: '/icons/primer_ruta.png',
        condicion: { tipo: 'primer_ruta' },
      },
      {
        nombre: 'Kilómetros Verdes',
        descripcion: 'Acumula un total de 10 km recorridos.',
        puntos: 100,
        iconoUrl: '/icons/10km.png',
        condicion: { tipo: 'kilometros_totales', valor: 10 },
      },
      {
        nombre: 'CO₂ Ahorro Pro',
        descripcion: 'Ahorra 1 kg de CO₂ en tus recorridos.',
        puntos: 150,
        iconoUrl: '/icons/co2.png',
        condicion: { tipo: 'co2_total', valor: 1 },
      },
    ])
  }
}
