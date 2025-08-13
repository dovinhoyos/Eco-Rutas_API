import RutaService from '#services/ruta_service'
import db from '@adonisjs/lucid/services/db'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Ruta from '#models/ruta'

@inject()
export default class RutasController {
  constructor(private rutaService: RutaService) {}

  async planificar({ request, auth }: HttpContext) {
    const { origen, destino, medioTransporte } = request.only([
      'origen',
      'destino',
      'medioTransporte',
    ])

    // origen y destino en formato [lng, lat]
    const result = await this.rutaService.planificarRuta(origen, destino, medioTransporte)

    // guardar en la DB con geometry
    const [ruta] = await db
      .table('rutas')
      .insert({
        id_usuario: auth.user!.id,
        origen: JSON.stringify(origen),
        destino: JSON.stringify(destino),
        medio_transporte: medioTransporte,
        distancia_km: result.distanciaKm,
        duracion_min: result.duracionMin,
        co2_ahorrado_kg: this.calcularCO2(result.distanciaKm, medioTransporte),
        geom: db.raw(`ST_SetSRID(ST_GeomFromGeoJSON(?), 4326)`, [JSON.stringify(result.geom)]),
      })
      .returning('*')

    return { ruta, geom: result.geom }
  }

  private calcularCO2(distanciaKm: number, medio: string) {
    // Valores estimados: auto = 0.21 kg/km, bicicleta/caminata = 0, transporte público ≈ 0.05
    if (medio === 'transporte_publico') return distanciaKm * 0.05
    return 0
  }

  async historial({ auth }: HttpContext) {
    const rutas = await Ruta.query()
      .where('id_usuario', auth.user!.id)
      .orderBy('created_at', 'desc')

    return rutas
  }

  /**
   * Calcular estadísticas de rutas
   */
  async estadisticas({ auth }: HttpContext) {
    const stats = await db
      .from('rutas')
      .where('id_usuario', auth.user!.id)
      .select(
        db.raw('SUM(distancia_km)::float as total_km'),
        db.raw('SUM(co2_ahorrado_kg)::float as total_co2'),
        db.raw('SUM(duracion_min)::float as total_min')
      )
      .first()

    return {
      totalKm: stats.total_km || 0,
      totalCO2: stats.total_co2 || 0,
      totalMin: stats.total_min || 0,
    }
  }
}
