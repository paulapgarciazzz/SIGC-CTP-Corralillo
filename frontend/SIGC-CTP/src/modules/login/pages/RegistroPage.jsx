import {useState} from 'react'
import {useForm} from '@tansack/react-form'
import {Link, useNavigate} from '@tanstack/react-router'
import {useAuth} from '../../../auth/hooks/useAuth'

export default function RegistroPage() {
    const {register} = useAuth()
    const navigate = useNavigate()
    const [sending, setSending] = useState(false)
    const [fail, setFail] = useState(null)

    const form = useForm({
        defaultValues: {nombre: '', email: '', password: '', confirmPassword: ''},
        onSubmit: async ({value}) => {
            setFail(null)
            setSending(true)
            try {
                await register(value)
                navigate({to: '/'})
            } catch (error) {
                setFail( error?.response?.data?.mensaje ?? 'No se pudo completar el registro')
            } finally {
                setSending(false)
            }
        },
    })

    return (
        <div className= "login-page">
            <form
            className='login-form'
            onSubmit={(event)=>{
                event.preventDefault()
                form.handleSubmit()
            }}
            >
                <h1>Registro</h1>

                <form.Field
                    name="nombre"
                    validators={{
                        onChange: ({value}) => (!value?.trim() ? 'Por favor ingrese su nombre' : undefined),
                    }}
                >
                    {(field)=>(
                        <div className="form-group">
                        <label htmlFor='nombre'>Nombre</label>
                        <input
                            id='nombre'
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange= {(event)=> field.handleChange(event.target.value)}
                        />
                        {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
                        </div>
                    )}
                </form.Field>
                <form.Field
                    name="email"
                    validators={{
                        onChange: ({value}) => (!value?.trim() ? 'Por favor ingrese su correo electrónico' : undefined),
                    }}
                >
                    {(field)=>(
                        <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input
                            id='email'
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange= {(event)=> field.handleChange(event.target.value)}
                        />
                        {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
                        </div>
                    )}
                </form.Field>
                <form.Field
                    name="password"
                    validators={{
                        onChange: ({value}) => {
                            if (!value) return 'Por favor ingrese su contraseña'
                            if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
                            return undefined
                        },
                    }}
                >
                    {(field)=>(
                        <div className="form-group">
                        <label htmlFor='password'>Contraseña</label>
                        <input
                            id='password'
                            name={field.name}
                            type='password'
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange= {(event)=> field.handleChange(event.target.value)}
                        />
                        {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
                        </div>
                    )}
                </form.Field>
                {fail ? <p className='form-error'>{fail}</p> : null}

                <button type='submit' disabled={sending}>
                    {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
                <p>
                    ¿Ya tienes una cuenta? <link to="/login">Inicia sesión</link>
                </p>
            </form>
        </div>
    )
}