import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../lib/store/app-store'

const Auth = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate()
    const { setUser } = useAppStore()
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) navigate('/login')
        setUser(user ? JSON.parse(user) : null)
    }, [navigate, setUser])

    return <>{children}</>
}

export default Auth
