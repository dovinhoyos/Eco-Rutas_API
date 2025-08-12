import User from '../app/models/user.js'

export default class AdministradorService {
    async getUser(){
        return await User.query()
    }

    async getUserById(id: number){
        return await User.findOrFail(id)
    }
    async deleteUser(id: number){
        const user = await User.findOrFail(id)
        return await user.delete()
    }

    async updateRole(id: number, role: 'usuario' | 'admin') {
        const user = await User.findOrFail(id)
        user.rol = role
        await user.save()
        return user
    }

}