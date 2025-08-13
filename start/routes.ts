import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const SocialAuthController = () => import('#controllers/social_auths_controller')
const RutasController = () => import('#controllers/ruta_controller')
const RankingController = () => import('#controllers/rankings_controller')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('redirect/:provider', [SocialAuthController, 'redirect'])
    router.get('callback/:provider', [SocialAuthController, 'callback'])
  })
  .prefix('auth')

router
  .group(() => {
    router.post('planificar', [RutasController, 'planificar']).use(middleware.auth())
    router.get('historial', [RutasController, 'historial'])
    router.get('estadisticas', [RutasController, 'estadisticas'])
  })
  .prefix('/rutas')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [RankingController, 'index'])
  })
  .prefix('/ranking')
  .use(middleware.auth())
