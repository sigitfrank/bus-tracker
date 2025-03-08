import { LatLngTuple } from "leaflet"

export type Bus = {
    id: string
    name: string
    coordinates: LatLngTuple
    createdAt: number
    updatedAt: number
}