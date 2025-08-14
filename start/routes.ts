import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const RutasController = () => import('#controllers/rutas_controller')
const UsersController = () => import('#controllers/users_controller')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('auth')

router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
    router.post('/', [UsersController, 'store'])
    router.put('/:id', [UsersController, 'edit'])
    router.delete('/:id', [UsersController, 'destroy'])
  })
  .prefix('users')

router
  .group(() => {
    router.post('/', [RutasController, 'store'])
    router.get('/', [RutasController, 'index'])
  })
  .prefix('routes')
  .use(middleware.auth())
