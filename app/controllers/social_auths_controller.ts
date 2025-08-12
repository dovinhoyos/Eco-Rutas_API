// app/Controllers/Http/Auth/SocialAuthController.ts
import type { HttpContext } from '@adonisjs/core/http'
import SocialAuthService from '#services/social_auth_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SocialAuthController {
  constructor(private socialAuthService: SocialAuthService) {}

  /**
   * Redirige al proveedor (Google o GitHub)
   */
  async redirect({ params, ally, response }: HttpContext) {
    const provider = params.provider

    if (!['google', 'github'].includes(provider)) {
      return response.badRequest({ error: 'Proveedor no soportado' })
    }

    return ally.use(provider).redirect()
  }

  /**
   * Callback del proveedor después del login
   */
  async callback({ params, ally, response }: HttpContext) {
    const provider = params.provider

    if (!['google', 'github'].includes(provider)) {
      return response.badRequest({ error: 'Proveedor no soportado' })
    }

    try {
      const { user, token } = await this.socialAuthService.handleCallback(provider, ally)
      return response.ok({ user, token })
    } catch (error) {
      console.error(error)
      return response.badRequest({ error: 'No se pudo autenticar con ' + provider })
    }
  }
}
