import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import AdministradorService from '../../services/administradorService.js'

export default class AdministradorController {
  private adminService = new AdministradorService()

  // GET /admin/users
  public async index({ response }: { response: ResponseContract }) {
    try {
      const users = await this.adminService.getUser()
      return response.ok(users)
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message })
    }
  }

  // GET /admin/users/:id
  public async show({
    params,
    response,
  }: {
    params: { id: number }
    response: ResponseContract
  }) {
    try {
      const user = await this.adminService.getUserById(params.id)
      return response.ok(user)
    } catch (error) {
      return response.status(404).json({ error: 'Usuario no encontrado' })
    }
  }

  // DELETE /admin/users/:id
  public async destroy({
    params,
    response,
  }: {
    params: { id: number }
    response: ResponseContract
  }) {
    try {
      await this.adminService.deleteUser(params.id)
      return response.ok({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
      return response.status(404).json({ error: 'Usuario no encontrado' })
    }
  }

  // PUT /admin/users/:id/role
  public async updateRole({
    params,
    request,
    response,
  }: {
    params: { id: number }
    request: RequestContract
    response: ResponseContract
  }) {
    try {
      const role = request.input('role') // 'usuario' | 'admin'
      const user = await this.adminService.updateRole(params.id, role)
      return response.ok(user)
    } catch (error) {
      return response.status(400).json({ error: (error as Error).message })
    }
  }
}
