import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body

        const trx = await knex.transaction()
        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: 'image-fake'
        }
        const ids = await trx('points').insert(point)

        await trx('point_items').insert(items.map((item: number) => {
            return {
                item_id: item,
                point_id: ids[0]
            }
        }))

        await trx.commit()

        return res.json({
            id: ids[0],
            ...point
        })
    }

    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query

        const parserItems = String(items).split(',').map(item => Number(item.trim()))

        const points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parserItems)
                .where('city', String(city))
                .where('uf', String(uf))
                .distinct()
                .select('points.*')

        return res.json(points)
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const point = await knex('points').where('id', id).first()

        if (!point)
            return res.status(400).json({ message: 'Point not found.' })

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        return res.json({point, items})
    }
}

export default PointsController