import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Button, Grid2, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getBusById, saveOrUpdateBusLocation } from '../lib/api/bus.api'
import useAppStore from '../lib/store/app-store'

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1068/1068631.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
})

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/18827/18827925.png ",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
})

const Map = () => {
  const { user } = useAppStore()
  const params = useParams()
  const navigate = useNavigate()
  const [busPosition, setBusPosition] = useState<[number, number] | null>(null)
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [route, setRoute] = useState<[number, number][]>([])
  const [distance, setDistance] = useState<string>('0')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          if (user?.name === 'driver') {
            setBusPosition([latitude, longitude])
            saveOrUpdateBusLocation({
              id: params.id as string,
              coordinates: [latitude, longitude]
            })
          } else {
            setUserPosition([latitude, longitude])
          }
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      )
    }
  }, [user, params.id])

  // GET bus coordinates for user to see the bus
  useEffect(() => {
    if (!params.id) return
    getBusById(params.id as string).then((coordinates) => {
      setBusPosition(coordinates)
    })
  }, [params.id])

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

  if (!busPosition || !userPosition) return null
  return (
    <Grid2 container justifyContent="center">
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '16px'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Typography variant='h4'>Tracking Bus</Typography>
            <Button color='error' variant='outlined' onClick={() => navigate('/')}>Back</Button>
          </Box>
          <Box sx={{
            height: 'calc(90svh - 10px)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <MapContainer center={userPosition} zoom={13}>
              <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />
              <Marker position={busPosition} icon={busIcon}>
                <Popup>
                  Bus position: {distance}km away from you
                </Popup>
              </Marker>
              <Marker position={userPosition} icon={userIcon}>
                <Popup>
                  You are here
                </Popup>
              </Marker>
              {route.length > 0 && <Polyline positions={route} color='#DDD' />}
            </MapContainer>
          </Box>
        </Box>
      </Grid2>
    </Grid2>)
}

export default Map
