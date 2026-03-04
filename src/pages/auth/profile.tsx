import { useLazyGetUserQuery } from '@/redux/services/authApi'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Profile = () => {
    const { id } = useParams<{ id: string }>()
    const [getUser, { isLoading, error, data: userData }] = useLazyGetUserQuery()

    useEffect(() => {
        if (id) {
            getUser(id)
        }
    }, [getUser, id])

    return (
        <div>
            {isLoading ? (
                <p>Loading user data...</p>
            ) : error ? (
                <p>Error loading user data: {error.toString()}</p>
            ) : (
                <p>User data: {JSON.stringify(userData)}</p>
            )}
        </div>
    )
}

export default Profile
