import { serverTimestamp, setDoc, doc, addDoc, collection, query, where, getDocs, getDoc, onSnapshot } from 'firebase/firestore'
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
        if (!snapshot.empty) {
            const userQuery = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] as User
            if (userQuery.role !== user.role) throw new Error(`You are a ${userQuery.role}. Please adjust the role.`)
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0]
        }
        const res = await addDoc(collection(firebaseDB, collectionKey.users), {
            name: user.name,
            normalizedUserName,
            role: user.role,
            coordinates: JSON.stringify(user.coordinates),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
        const createdUser = await getDoc(res)
        return { id: res.id, ...createdUser.data() }
    }
}
export const getUserById = (userId: string, callback: (user: User) => void) => {
    const docRef = doc(firebaseDB, collectionKey.users, userId)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const user = { id: docSnap.id, ...docSnap.data(), coordinates: JSON.parse(docSnap.data().coordinates) }
            callback(user as User)
        } else {
            console.log('No such user!')
        }
    })
    return unsubscribe
}
export const getUsers = (callback: (users: User[]) => void) => {
    const usersRef = collection(firebaseDB, collectionKey.users)
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), coordinates: JSON.parse(doc.data().coordinates), }))
        callback(users as User[])
    })
    return unsubscribe
}