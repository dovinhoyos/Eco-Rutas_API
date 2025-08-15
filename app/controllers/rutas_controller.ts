import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import axios from 'axios'

export default class RutasController {
  async store({ request, auth, response }: HttpContext) {
    const { medioTransporte, waypoints } = request.only(['medioTransporte', 'waypoints'])

    // Validar datos básicos
    if (!['bicicleta', 'caminando', 'transporte_publico'].includes(medioTransporte)) {
      return response.badRequest({
        error: 'Modo inválido. Usa bicicleta, caminando o transporte_publico.',
      })
    }
    if (!Array.isArray(waypoints) || waypoints.length < 2) {
      return response.badRequest({ error: 'Se requieren al menos dos puntos en waypoints' })
    }

    // Construir string coords en formato OSRM: lng,lat;lng,lat
    const coords = waypoints.map(([lat, lng]: [number, number]) => `${lng},${lat}`).join(';')

    // Mapear perfil OSRM
    const profileMap: Record<string, string> = {
      medioTransporte: 'bicycle',
      caminando: 'foot',
      transporte_publico: 'foot',
    }
    const profile = profileMap[medioTransporte]

    const OSRM_HOST = process.env.OSRM_HOST || 'http://router.project-osrm.org'
    const url = `${OSRM_HOST}/route/v1/${profile}/${coords}?overview=full&geometries=geojson`

    try {
      console.log('🔍 Consultando OSRM:', url)
      const osrmResp = await axios.get(url)

      if (!osrmResp.data?.routes?.length) {
        return response.notFound({ error: 'OSRM no devolvió ninguna ruta' })
      }

      const route = osrmResp.data.routes[0]
      const { distance, duration, geometry } = route

      // Calcular CO2 ahorrado
      const co2PerKm = 0.21
      const km = distance / 1000
      const co2AhorradoKg = Number.parseFloat((km * co2PerKm).toFixed(3))

      // Guardar en PostGIS
      const geojsonStr = JSON.stringify(geometry)
      const insertQuery = `
        INSERT INTO rutas (id_usuario, medio_transporte, origen, destino, distancia_km, duracion_min, co2_ahorrado_kg, geom, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ST_SetSRID(ST_GeomFromGeoJSON(?), 4326), now())
        RETURNING id
      `
      const inserted = await db.rawQuery(insertQuery, [
        auth.user!.id,
        medioTransporte,
        `${waypoints[0][1]},${waypoints[0][0]}`,
        `${waypoints[waypoints.length - 1][1]},${waypoints[waypoints.length - 1][0]}`,
        distance,
        duration,
        co2AhorradoKg,
        geojsonStr,
      ])

      const id = inserted.rows[0].id

      // Leer ruta guardada
      const readQuery = `
        SELECT id, medio_transporte, origen, destino, distancia_km, duracion_min, co2_ahorrado_kg, ST_AsGeoJSON(geom) as geom_geojson
        FROM rutas WHERE id = ?
      `
      const saved = await db.rawQuery(readQuery, [id])
      const row = saved.rows[0]

      return response.created({
        id: row.id,
        medioTransporte: row.medio_transporte,
        origin: row.origen,
        destination: row.destino,
        distanciaKm: Number(row.distancia_km),
        duracionMin: Number(row.duracion_min),
        co2AhorradoKg: Number(row.co2_ahorrado_kg),
        geometry: JSON.parse(row.geom_geojson),
      })
    } catch (err) {
      console.error('❌ Error en OSRM/PostGIS:', err.response?.data || err.message || err)
      return response.internalServerError({ error: 'Error al calcular/guardar la ruta' })
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
  }
}
