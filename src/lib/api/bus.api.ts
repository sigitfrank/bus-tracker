import { serverTimestamp, setDoc, doc, addDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'
import { firebaseDB } from '../firebase'
import { Bus } from '../types/bus.type'
import { collectionKey } from '../query/keys'

export const saveOrUpdateBusLocation = async (bus: Partial<Bus> & { id?: string }) => {

    if (bus.id) {
        await setDoc(doc(firebaseDB, collectionKey.buses, bus.id), {
            coordinates: JSON.stringify(bus.coordinates),
            updatedAt: serverTimestamp()
        }, { merge: true })
    } else {

        if (!bus.name) throw new Error('Bus name is required')

        const normalizedBusName = bus.name?.toLowerCase()
        const q = query(collection(firebaseDB, collectionKey.buses), where('normalizedBusName', '==', normalizedBusName))
        const snapshot = await getDocs(q)
        if (!bus.id && !snapshot.empty) {
            throw new Error('Bus name is already registered!')
        }
        await addDoc(collection(firebaseDB, collectionKey.buses), {
            name: bus.name,
            normalizedBusName,
            coordinates: JSON.stringify(bus.coordinates),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
    }
}

export const getBusById = async (busId: string) => {
    const docRef = doc(firebaseDB, collectionKey.buses, busId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        const data = docSnap.data()
        const coordinates = JSON.parse(data.coordinates ?? '[]')
        return coordinates
    } else {
        console.log('No such bus!')
    }
}