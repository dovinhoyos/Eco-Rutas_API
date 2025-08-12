import vine from '@vinejs/vine'

export const crearRutaValidator = vine.compile(
  vine.object({
    origen: vine.string().trim(),
    destino: vine.string().trim(),
    medioTransporte: vine.enum(['bicicleta', 'caminando', 'transporte_publico']),
  })
)
