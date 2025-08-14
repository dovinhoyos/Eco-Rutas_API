import vine from '@vinejs/vine'

export const rutaValidator = vine.compile(
  vine.object({
    medioTransporte: vine.enum(['bicicleta', 'caminando', 'transporte_publico']),
    waypoints: vine
      .array(vine.tuple([vine.number().min(-90).max(90), vine.number().min(-180).max(180)]))
      .minLength(2),
  })
)
