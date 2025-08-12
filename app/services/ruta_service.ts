// app/Services/RutaService.ts
import axios from 'axios'

type MedioTransporte = 'bicicleta' | 'caminando' | 'transporte_publico'

export default class RutaService {
  private osrmBaseUrl = 'https://router.project-osrm.org' // o tu propio servidor

  private medioToProfile(medio: MedioTransporte) {
    switch (medio) {
      case 'bicicleta':
        return 'bike'
      case 'caminando':
        return 'foot'
      default:
        // OSRM no soporta transporte público, podríamos fallback a foot
        return 'car'
    }
  }

  async planificarRuta(
    origen: [number, number],
    destino: [number, number],
    medioTransporte: MedioTransporte
  ) {
    const profile = this.medioToProfile(medioTransporte)

    const coords = `${origen[0]},${origen[1]};${destino[0]},${destino[1]}`

    const url = `${this.osrmBaseUrl}/route/v1/${profile}/${coords}?overview=full&geometries=geojson`

    const { data } = await axios.get(url)

    if (!data.routes || !data.routes.length) {
      throw new Error('No se encontró ruta')
    }

    const route = data.routes[0]

    return {
      distanciaKm: route.distance / 1000,
      duracionMin: route.duration / 60,
      geom: route.geometry,
    }
  }
}
