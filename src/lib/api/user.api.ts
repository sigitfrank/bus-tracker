import { serverTimestamp, setDoc, doc, addDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'
import { firebaseDB } from '../firebase'
import { collectionKey } from '../query/keys'
import { User } from '../types/user.type'

export const saveOrUpdateUserLocation = async (user: Partial<User> & { id?: string }) => {

    if (user.id) {
        await setDoc(doc(firebaseDB, collectionKey.users, user.id), {
            coordinates: JSON.stringify(user.coordinates),
            updatedAt: serverTimestamp()
        }, { merge: true })
    } else {

        if (!user.name) throw new Error('User name is required')

        const normalizedUserName = user.name?.toLowerCase()
        const q = query(collection(firebaseDB, collectionKey.users), where('normalizedUserName', '==', normalizedUserName))
        const snapshot = await getDocs(q)
        if (!user.id && !snapshot.empty) {
            return true
        }
        await addDoc(collection(firebaseDB, collectionKey.users), {
            name: user.name,
            normalizedUserName,
            coordinates: JSON.stringify(user.coordinates),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
    }
}

export const getUserById = async (userId: string) => {
    const docRef = doc(firebaseDB, collectionKey.users, userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        const data = docSnap.data()
        const coordinates = JSON.parse(data.coordinates ?? '[]')
        return coordinates
    } else {
        console.log('No such user!')
    }
}