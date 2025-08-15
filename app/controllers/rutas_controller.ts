import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import axios from 'axios'
import Ruta from '#models/ruta'

export default class RutasController {
  public async store({ request, auth, response }: HttpContext) {
    const { medioTransporte, origen, destino } = request.only([
      'medioTransporte',
      'origen',
      'destino',
    ])

    if (!['bicicleta', 'caminando', 'transporte_publico'].includes(medioTransporte)) {
      return response.badRequest({ error: 'Modo inválido' })
    }
    if (
      !Array.isArray(origen) ||
      origen.length !== 2 ||
      !Array.isArray(destino) ||
      destino.length !== 2
    ) {
      return response.badRequest({ error: 'Formato de coordenadas inválido' })
    }

    const profileMap = {
      bicicleta: 'bicycle',
      caminando: 'foot',
      transporte_publico: 'driving',
    }

    const profile = profileMap[medioTransporte as keyof typeof profileMap]

    const OSRM_HOST = env.get('OSRM_HOST')
    const coords = `${origen[1]},${origen[0]};${destino[1]},${destino[0]}`
    const url = `${OSRM_HOST}/route/v1/${profile}/${coords}?overview=full&geometries=geojson`

    try {
      const osrmResp = await axios.get(url)
      if (!osrmResp.data?.routes?.length) {
        return response.notFound({ error: 'No se encontró ruta' })
      }

      const { distance, duration } = osrmResp.data.routes[0]
      const distanciaKm = Number((distance / 1000).toFixed(3))
      const duracionMin = Math.round(duration / 60)
      const co2AhorradoKg = Number((distanciaKm * 0.21).toFixed(3))

      const ruta = await Ruta.create({
        idUsuario: auth.user!.id,
        medioTransporte,
        origen,
        destino,
        distanciaKm,
        duracionMin,
        co2AhorradoKg,
      })

      return response.created({
        medioTransporte: ruta.medioTransporte,
        origen: ruta.origen,
        destino: ruta.destino,
      })
    } catch (err) {
      console.error('Error en OSRM:', err.message)
      return response.internalServerError({ error: 'Error al calcular ruta' })
    }
  }

  public async index({ auth, response }: HttpContext) {
    try {
      const query = `
      SELECT id, medio_transporte, origen, destino, distancia_km, duracion_min, co2_ahorrado_kg, 
             ST_AsGeoJSON(geom) as geom_geojson, created_at
      FROM rutas
      WHERE id_usuario = ?
      ORDER BY created_at DESC
    `
      const routes = await db.rawQuery(query, [auth.user!.id])

      return response.ok(
        routes.rows.map((route: any) => ({
          id: route.id,
          medio_transporte: route.medio_transporte,
          origen: route.origen,
          destino: route.destino,
          distanciaKm: Number(route.distancia_km),
          duracionMin: Number(route.duracion_min),
          co2AhorradoKg: Number(route.co2_ahorrado_kg),
          created_at: route.created_at,
          geometry: JSON.parse(route.geom_geojson),
        }))
      )
    } catch (err) {
      console.error('❌ Error obteniendo rutas:', err)
      return response.internalServerError({ error: 'Error al obtener rutas' })
    }
    const rutas = await Ruta.query()
      .where('id_usuario', auth.user!.id)
      .orderBy('created_at', 'desc')
    return response.ok(
      rutas.map((ruta) => ({
        medioTransporte: ruta.medioTransporte,
        origen: ruta.origen,
        destino: ruta.destino,
      }))
    )
  }
}
