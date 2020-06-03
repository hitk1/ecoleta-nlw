import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemController {

    async index(req: Request, res: Response) {
        const items = await knex('items').select('*')

        const serializedItems = items.map(item => {
            return {
                name: item.title,
                image_url: `http://127.0.0.1:3333/uploads/${item.image}`
            }
        })

        return res.json(serializedItems)
    }
}

export default ItemController