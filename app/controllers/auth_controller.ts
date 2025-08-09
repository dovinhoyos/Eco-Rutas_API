import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'
import Usuario from '#models/usuario'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const usuario = await Usuario.create(payload)

      return response.created(usuario)
    } catch (error) {
      return response.badRequest({ error: 'Registration failed', details: error.messages })
    }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const usuario = await Usuario.verifyCredentials(email, password)
    const token = await Usuario.accessTokens.create(usuario)

    return response.ok({
      token: token,
    })
  }

  async logout({ auth, response }: HttpContext) {
    const usuario = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await Usuario.accessTokens.delete(usuario, token)
    return response.ok({ message: 'Logged out' })
  }
}
