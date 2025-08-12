// app/Services/SocialAuthService.ts
import Usuario from '#models/usuario'

export default class SocialAuthService {
  async handleCallback(provider: string, ally: any) {
    const socialUser = await ally.use(provider).user()

    const user = await Usuario.findOrCreateSocialUser({
      email: socialUser.email!,
      nombre: socialUser.name?.split(' ')[0],
      apellido: socialUser.name?.split(' ')[1] || '',
      provider,
      providerId: socialUser.id,
      avatarUrl: socialUser.avatarUrl,
    })

    const token = await user.createToken('api-token', { expiresIn: '7d' })
    return { user, token: token.token }
  }
}
