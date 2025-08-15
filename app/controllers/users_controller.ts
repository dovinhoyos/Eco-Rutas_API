import Usuario from '#models/usuario'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const usuarios = await Usuario.all()
    return response.ok(usuarios)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['nombre', 'apellido', 'email', 'password', 'rol'])

    const usuario = await Usuario.create(data)

    return response.created({
      message: 'Usuario creado correctamente',
      usuario,
    })
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const usuario = await Usuario.findOrFail(params.id)
    return response.ok(usuario)
  }

  /**
   * Edit individual record
   */
  async edit({ params, response, request }: HttpContext) {
    const usuario = await Usuario.findOrFail(params.id)

    const data = request.only(['nombre', 'apellido', 'email', 'rol'])

    usuario.merge(data)

    await usuario.save()

    return response.ok({
      message: 'Usuario actualizado correctamente',
      usuario,
    })
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const usuario = await Usuario.findOrFail(params.id)

    await usuario.delete()

    return response.ok({
      message: 'Usuario eliminado correctamente',
    })
  }
}
