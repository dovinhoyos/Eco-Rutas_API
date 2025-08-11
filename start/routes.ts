import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const RutasController = () => import('#controllers/rutas_controller')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('user')

router
  .group(() => {
    router.post('/routes', [RutasController, 'store'])
    router.get('/routes', [RutasController, 'index'])
  })
  .use(middleware.auth())

router
  .get('me', async ({ auth, response }) => {
    try {
      const user = auth.getUserOrFail()
      return response.ok(user)
    } catch (error) {
      return response.unauthorized({ error: 'User not found' })
    }
  })
  .use(middleware.auth())

router.get('/github/redirect', ({ ally }) => {
  return ally.use('github').redirect()
})

router.get('/github/callback', async ({ ally }) => {
  const gh = ally.use('github')

  /**
   * User has denied access by canceling
   * the login flow
   */
  if (gh.accessDenied()) {
    return 'You have cancelled the login process'
  }

  /**
   * OAuth state verification failed. This happens when the
   * CSRF cookie gets expired.
   */
  if (gh.stateMisMatch()) {
    return 'We are unable to verify the request. Please try again'
  }

  /**
   * GitHub responded with some error
   */
  if (gh.hasError()) {
    return gh.getError()
  }

  /**
   * Access user info
   */
  const user = await gh.user()
  console.log('GitHub User:', user)
  return user
})
