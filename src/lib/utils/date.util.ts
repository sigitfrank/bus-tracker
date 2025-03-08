import { format } from 'date-fns'

export const formatFirestoreTimestamp = (seconds: number) => {
    const date = new Date(seconds * 1000)
    return format(date, 'yyyy-MM-dd HH:mm a')
}
