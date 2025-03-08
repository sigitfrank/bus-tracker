import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Auth = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate()

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) navigate('/login')
    }, [navigate])

    return <>{children}</>
}

export default Auth
