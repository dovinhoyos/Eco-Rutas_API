// app/Controllers/Http/RutasController.ts
import RutaService from '#services/ruta_service'
import db from '@adonisjs/lucid/services/db'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

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
}
