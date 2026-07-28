import {useState} from 'react'
import {useForm} from '@tansack/react-form'
import {Link, useNavigate} from '@tanstack/react-router'
import {useAuth} from '../../../auth/hooks/useAuth'
import './login.css'

export default function LoginPage() {
    const {login} = useAuth()
    const navigate = useNavigate()
    const [sending, setSending] = useState(false)
    const [fail, setFail] = useState(null)

    const form = useForm({
        defaultValues: { email: '', password: '' },
        onSubmit: async ({value}) => {
            setFail(null)
            setSending(true)
            try {
                await login(value)
                navigate ({to: '/' })
            }catch (error) {
                if(error?.response){
                    const msg = error.response.data?.message ??
                    error.response.data?.mensaje ??
                    (error.response.status === 401 ? 'Usuario o contraseña incorrectos' : `Error ${error.response.status}`)
                    setFail(msg)
                }else if (error?.request) {
                    setFail('No se pudo conectar con el servidor')
                }else {
                    setFail('Error desconocido')
                }
            }finally {
                setSending(false)
            }
        },
    })

    return (
       <div className="login-page">
        <form
        className = "login-form"
        onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
        }}
        >
            <h1>Iniciar sesión</h1>
            <form.Field
                name="email"
                validators={{
                    onChange: ({ value }) => (!value?.trim() ? 'Por favor ingrese su correo electrónico' : undefined),
                }}
            >
                {(field) =>(
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onChange={(event) => field.handleChange(event.target.value)}
                            onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="password"
                validators={{
                    onChange: ({value}) => (!value ? 'Por favor ingrese su contraseña' : undefined),
                }}
            >
                {(field) => (
                    <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
                    </div>
                )}
            </form.Field>
            {fail ? <p className="form-error">{fail}</p> : null}

            <button type="submit" disabled={sending}>
                {sending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            <p>
                ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </p>
            <p>
                ¿Olvidaste tu contraseña? <Link to="/forgot-password">Recuperar contraseña</Link>
            </p>


        </form> 
    </div>
    )
}
    

