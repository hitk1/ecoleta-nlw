
export interface IRouteDetailParam {
    point_id: number
}

export interface IData {
    point: {
        image: string,
        image_url: string,
        name: string,
        email: string,
        whatsapp: string
        city: string,
        uf: string
    },
    items: {
        title: string
    }[]
}