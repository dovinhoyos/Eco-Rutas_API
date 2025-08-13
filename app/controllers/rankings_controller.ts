import RecompensaService from '#services/recompensa_service'
import { inject } from '@adonisjs/core'

@inject()
export default class RankingController {
  constructor(private recompensaService: RecompensaService) {}

  async index() {
    return await this.recompensaService.obtenerRanking()
  }
}
