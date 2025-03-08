import { useEffect, useState } from 'react'

const useDistance = ({
    busPosition,
    userPosition
}: {
    busPosition: [number, number] | null
    userPosition: [number, number] | null
}) => {
    const [route, setRoute] = useState<[number, number][]>([])
    const [distance, setDistance] = useState<string>('0')

    // GET routes between user and bus
    useEffect(() => {
        const fetchRoute = async () => {
            if (!busPosition || !userPosition) return

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${busPosition[1]},${busPosition[0]};${userPosition[1]},${userPosition[0]}?geometries=geojson`
            )
            const data = await response.json()
            if (!data.routes) return
            const coordinates = data.routes[0]?.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng])
            setRoute(coordinates)
            const distanceInKm = (data.routes[0]?.distance / 1000).toFixed(2)
            setDistance(distanceInKm)
        }

        fetchRoute()
    }, [busPosition, userPosition])

    return {
        route,
        distance
    }

}

export default useDistance