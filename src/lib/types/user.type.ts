import { LatLngTuple } from "leaflet"

export type User = {
    name: string
    role: 'driver' | 'passenger'
    coordinates: LatLngTuple
    createdAt: number
    updatedAt: number
}