import { Router } from 'express'

import PointsController from './controllers/PointsController'
import ItemController from './controllers/ItemsController'

const routes = Router()
const pointsController = new PointsController()
const itemController = new ItemController()

routes.get('/items', itemController.index)
routes.post('/points', pointsController.create)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export default routes