import { Fragment, useEffect, useState } from 'react'
import { firebaseDB } from '../lib/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Button, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Bus } from '../lib/types/bus.type'
import useAppStore from '../lib/store/app-store'
import { DirectionsBus } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { formatFirestoreTimestamp } from '../lib/utils/date.util'
import { collectionKey } from '../lib/query/keys'

const BusSelector = () => {
  const navigate = useNavigate()
  const [buses, setBuses] = useState<Bus[]>([])
  const { setSelectedBus } = useAppStore()
  useEffect(() => {
    const q = query(collection(firebaseDB, collectionKey.buses), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const buses = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        coordinates: JSON.parse(doc.data().coordinates ?? '[]'),
        createdAt: doc.data().createdAt.seconds,
        updatedAt: doc.data().updatedAt.seconds
      }))
      setBuses(buses)
    })

    return () => unsubscribe()
  }, [])

  const handleSelect = (bus: Bus) => {
    setSelectedBus(bus)
    navigate(`/tracking/${bus.id}`)
  }
  return (
    <List sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}>
      {buses.map((bus, index) => (<Fragment key={bus.id}>
        <ListItem disablePadding >
          <ListItemButton
            sx={{
              borderRadius: '4px',
            }}
            onClick={() => handleSelect(bus)}
          >
            <ListItemText primary={bus.name} secondary={formatFirestoreTimestamp(bus.createdAt)} />
            <Button startIcon={<DirectionsBus />}>Track</Button>
          </ListItemButton>
        </ListItem>
        {index < buses.length - 1 && <Divider />}
      </Fragment>))}
    </List>
  )
}

export default BusSelector
