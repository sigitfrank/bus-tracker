import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Button, Grid2, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../lib/store/app-store'
import useBus from '../lib/hooks/use-bus'
import useUser from '../lib/hooks/use-user'
import useDistance from '../lib/hooks/use-distance'

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
  const navigate = useNavigate()

  const { busPosition } = useBus()
  const { userPosition, allUsers } = useUser()
  const { distance, route } = useDistance({
    busPosition,
    userPosition
  })

  if (!busPosition || (!userPosition && user?.role === 'passenger')) return <Box sx={{
    padding: 4
  }}>Gathering coordinates...</Box>
  const center = user?.role === 'passenger' ? userPosition : busPosition
  if (!center) return
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
            <MapContainer center={center} zoom={13}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={busPosition} icon={busIcon}>
                <Popup>
                  {
                    user?.role === 'driver' ? 'You are the driver. Pick all the users' : `Bus position: ${distance}km away from you`
                  }
                </Popup>
              </Marker>
              {
                allUsers.map((allUser) => {
                  return <Marker key={allUser.id} position={allUser.coordinates} icon={userIcon}>
                    <Popup>
                      {allUser.id === user?.id ? 'You are here' : `It is ${allUser.name}`}
                    </Popup>
                  </Marker>
                })
              }

              {route.length > 0 && <Polyline positions={route} color='#b80000' />}
            </MapContainer>
          </Box>
        </Box>
      </Grid2>
    </Grid2>)
}

export default Map
