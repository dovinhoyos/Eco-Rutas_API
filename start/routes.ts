import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const SocialAuthController = () => import('#controllers/social_auths_controller')
const PlanificadorController = () => import('#controllers/ruta_controller')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    router.post('planificar', [PlanificadorController, 'planificar']).use(middleware.auth())
  })
  .prefix('user')

router
  .group(() => {
    router.get('redirect/:provider', [SocialAuthController, 'redirect'])
    router.get('callback/:provider', [SocialAuthController, 'callback'])
  })
  .prefix('/auth')
