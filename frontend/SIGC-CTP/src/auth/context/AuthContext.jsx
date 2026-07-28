import { useCallback, useEffect, useMemo, useState } from "react"
import { AuthContext } from "./authContextProvider"
import * as authService from "../../services/authService"
import { TOKEN_STORAGE_KEY } from "../../services/apiClient"

export default function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
    const [usuario, setUsuario] = useState(null)
    const [permisos, setPermisos] = useState([])
    const [loading, setLoading] = useState(true)

    const iniciarSesion = useCallback((data) => {
        setToken(data.token)
        setUsuario(data.usuario)
        setPermisos(data.permisos ?? [])
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
    },[])

    const cerrarSesion = useCallback(() => {
        setToken(null)
        setUsuario(null)
        setPermisos([])
        localStorage.removeItem(TOKEN_STORAGE_KEY)
    }, [])

    useEffect(() => {
        const verificarSesion = async () => {
            if(!localStorage.getItem(TOKEN_STORAGE_KEY)){
                setLoading(setLoading)
                return
            }
            try {
                const data = await authService.currentUser()
                setUsuario(data.usuario)
                setPermisos(data.permisos ?? [])
            }catch {
                cerrarSesion()
            }finally {
                setLoading(false)
            }
        }

        verificarSesion()
    }, [cerrarSesion])

    const login = useCallback(
        async (credenciales)=> {
            const data = await authService.login(credenciales)
            iniciarSesion(data)
            return data
        },[iniciarSesion])

    const register= useCallback(
        async (datos)=> {
            const data = await authService.register(datos)
            iniciarSesion(data)
            return data
        },[iniciarSesion])
    const logout = useCallback(() => {
        cerrarSesion()
    }, [cerrarSesion])

    const value = useMemo(
        () => ({
            token,
            usuario,
            permisos,
            loading,
            sesionIniciada: Boolean(token && usuario),
            login,
            register,
            logout,
            allowed: (clave) => permisos.includes(clave),
        }),
        [token, usuario, permisos, loading, login, register, logout],
    )
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}