import { serverTimestamp, setDoc, doc, addDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore'
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

export const getBusById = (busId: string, callback: (bus: Bus) => void) => {
    const docRef = doc(firebaseDB, collectionKey.buses, busId)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const bus = { id: docSnap.id, ...docSnap.data(), coordinates: JSON.parse(docSnap.data().coordinates) }
            callback(bus as Bus)
        } else {
            console.log('No such bus!')
        }
    })
    return unsubscribe
}