import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'

import logo from '../../assets/logo.svg'
import './styles.css'
import api from '../../services/api'
import { IPointsItems, IUfIbgeResponse, ICitiesIbgeResponse } from './interfaces'

const CreatePoint: React.FC = () => {

    const [items, setItems] = useState<IPointsItems[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    useEffect(() => {
        api.get('/items').then(response => {
            if (response.data)
                setItems(response.data)
        })

        axios.get<IUfIbgeResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            if (response.data)
                setUfs(response.data.map(item => item.sigla))
        })

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })

    }, [])

    useEffect(() => {
        if (selectedUf === '0')
            return

        axios.get<ICitiesIbgeResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            if (response.data)
                setCities(response.data.map(item => item.nome))
        })

    }, [selectedUf])

    const handleSelectedUf = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedUf(event.target.value)
    }, [])

    const handleSelectedCity = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(event.target.value)
    }, [])

    const handleMapClick = useCallback((event: LeafletMouseEvent) => {
        setSelectedPosition([event.latlng.lat, event.latlng.lng])
    }, [])

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })
    }, [formData])

    const handleSelectItem = useCallback((id: number) => {
        if (selectedItems.find(item => item === id))
            setSelectedItems(selectedItems.filter(item => item !== id))
        else
            setSelectedItems([...selectedItems, id])
    }, [selectedItems])

    const handleSubmit = useCallback((event: FormEvent) => {
        event.preventDefault()

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        api.post('/points', data).then(() => {
            alert('Ponto de Coleta criado com sucesso')
        }).catch(() => {
            alert('Ocorreu um erro na criação do Ponto de Coleta')
        })

        setFormData({
            name: '',
            email: '',
            whatsapp:''
        })
        setSelectedUf('')
        setSelectedCity('')
        setSelectedPosition([0, 0])
        setSelectedItems([])
    }, [formData, selectedUf, selectedCity, selectedPosition, selectedItems])


    return (
        <div id='page-create-point'>
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <Map
                    center={initialPosition}
                    zoom={15}
                    onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition} />
                </Map>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor='uf'>UF</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectedUf}>

                                <option value="0">Selecione uma UF</option>
                                {ufs && ufs.map(item => (
                                    <option
                                        key={item}
                                        value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor='city'>Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectedCity}>

                                <option value="0">Selecione uma cidade</option>
                                {cities && cities.map(item => (
                                    <option
                                        key={item}
                                        value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items && items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}>

                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type='submit'>Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint