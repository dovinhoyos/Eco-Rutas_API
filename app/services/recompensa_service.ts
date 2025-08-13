import Logro from '#models/logro'
import Usuario from '#models/usuario'

export default class RecompensasService {
  public async verificarLogros(usuario: Usuario) {
    const logros = await Logro.all()
    const rutas = await usuario.related('rutas').query()

    const totalKm = rutas.reduce((acc, r) => acc + r.distanciaKm, 0)
    const totalCo2 = rutas.reduce((acc, r) => acc + r.co2AhorradoKg, 0)
    const logrosObtenidos = await usuario.related('logros').query().select('logros.id')

    const idsObtenidos = logrosObtenidos.map((l) => l.id)

    for (const logro of logros) {
      if (idsObtenidos.includes(logro.id)) continue

      if (this.cumpleCondicion(logro.condicion, rutas.length, totalKm, totalCo2)) {
        await usuario.related('logros').attach({
          [logro.id]: { fecha_obtenido: new Date() },
        })
        usuario.puntos += logro.puntos
        await usuario.save()
      }
    }
  }

  private cumpleCondicion(
    condicion: any,
    cantidadRutas: number,
    totalKm: number,
    totalCo2: number
  ) {
    switch (condicion.tipo) {
      case 'primer_ruta':
        return cantidadRutas >= 1
      case 'kilometros_totales':
        return totalKm >= condicion.valor
      case 'co2_total':
        return totalCo2 >= condicion.valor
      default:
        return false
    }
  }
}
