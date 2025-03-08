import { LatLngTuple } from "leaflet"

export type User = {
    id: string
    name: string
    role: 'driver' | 'passenger'
    coordinates: LatLngTuple
    createdAt: number
    updatedAt: number
}