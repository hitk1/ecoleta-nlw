import React, { useCallback, useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'

import api from '../../services/api'
import { IPoints, IItems } from './interfaces'


const Points: React.FC = () => {

    const [items, setItems] = useState<IItems[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [points, setPoints] = useState<IPoints[]>([])

    useEffect(() => {
        api.get('/items').then(response => {
            if (response.data)
                setItems(response.data)
        })

        api.get('/points', {
            params: {
                city: 'Pindorama',
                uf: 'SP',
                items: [5]
            }
        }).then(response => {
            if (response.data)
                setPoints(response.data)
        })
    }, [])

    useEffect(() => {
        Location.requestPermissionsAsync().then(response => {
            if (response.status !== 'granted') {
                Alert.alert('Oops..', 'Precisamos de usar permissão para obter a localização')
                return
            }

            Location.getCurrentPositionAsync().then(response => {
                const { latitude, longitude } = response.coords
                setInitialPosition([latitude, longitude])
            })
        })
    }, [])

    const navigation = useNavigation()

    const handleNavigateBack = useCallback(() => {
        navigation.goBack()
    }, [])

    const handleNavigateToDetail = useCallback((id: number) => {
        navigation.navigate('Detail', { point_id: id })
    }, [])

    const handleSelectItem = useCallback((id: number) => {
        if (selectedItems.find(item => item === id))
            setSelectedItems(selectedItems.filter(item => item !== id))
        else
            setSelectedItems([...selectedItems, id])
    }, [selectedItems])

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name='arrow-left' size={20} color="#35CB79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView
                            loadingEnabled={initialPosition[0] === 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}
                            style={styles.map}
                        >
                            {points && points.map(item => (
                                <Marker
                                    key={item.id}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                    }}
                                    onPress={() => handleNavigateToDetail(item.id)}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage}
                                            source={{ uri: item.image_url }} />
                                        <Text style={styles.mapMarkerTitle}>{item.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items && items.map(item => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={String(item.id)}
                            onPress={() => handleSelectItem(item.id)}
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? styles.selectedItem : {}
                            ]}
                        >
                            <SvgUri
                                width={42}
                                height={42}
                                uri={item.image_url} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points