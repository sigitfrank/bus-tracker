import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAppStore from '../store/app-store'
import { getUserById, getUsers, saveOrUpdateUserLocation } from '../api/user.api'
import { User } from '../types/user.type'

const useUser = () => {
    const { user } = useAppStore()
    const params = useParams()
    const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
    const [allUsers, setAllUsers] = useState<User[]>([])

    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                // Logged in as passenger
                if (user?.role !== 'passenger' || !user?.id || !user.role) return
                setUserPosition([latitude, longitude])
                saveOrUpdateUserLocation({
                    id: user?.id,
                    coordinates: [latitude, longitude]
                })
            },
            (error) => console.error('Error getting location:', error),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        )
    }, [user, params.id])

    // Logged in as driver
    useEffect(() => {
        if (user?.role !== 'driver' || !user?.role) return
        const unsubscribe = getUsers((users) => {
            setAllUsers(users)
        })
        return () => unsubscribe()
    }, [user])

    // Logged in as passenger
    useEffect(() => {
        if (user?.role !== 'passenger' || !user?.id || !user.role) return
        const unsubscribe = getUserById(user?.id, (user) => {
            setAllUsers([user])
        })
        return () => unsubscribe()
    }, [user])

    return {
        userPosition,
        allUsers,
    }
}

export default useUser