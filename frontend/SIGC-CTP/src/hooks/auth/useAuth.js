import {useContext} from 'react'
import {AuthContext} from '../../context/auth/authContextProvider'

export default function useAuth() {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider')
    }
    return context
}