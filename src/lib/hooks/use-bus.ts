import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBusById, saveOrUpdateBusLocation } from '../api/bus.api'
import useAppStore from '../store/app-store'

const useBus = () => {
    const { user } = useAppStore()
    const params = useParams()
    const [busPosition, setBusPosition] = useState<[number, number] | null>(null)

    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                // Logged in as driver
                if (user?.role !== 'driver' || !user.role) return
                setBusPosition([latitude, longitude])
                saveOrUpdateBusLocation({
                    id: params.id as string,
                    coordinates: [latitude, longitude]
                })
            },
            (error) => {
                console.error('Error getting location:', error)
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        )
    }, [user, params.id])

    // Logged in as driver | passenger
    // GET bus coordinates
    useEffect(() => {
        if (!params.id) return
        getBusById(params.id as string, (bus) => {
            setBusPosition(bus.coordinates as [number, number])
        })
    }, [params.id])

    return {
        busPosition
    }
}

export default useBus