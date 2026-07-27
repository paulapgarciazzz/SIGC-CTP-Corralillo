import { useForm } from '@tanstack/react-form'

const getInitialValues = (firstRol) => ({
    nombre: firstRol?.nombre ?? '',
    descripcion: firstRol?.descripcion ?? '',
    permisosId: (firstRol?.permisos ?? []).map((p)=> (typeof p === 'object' ? p.id : p))
})

export default function RolesForm({ firstRol, catalogoPermisos= [], onSubmit, onCancelar}){
    const isEditando= Boolean(firstRol?.id || firstRol?.nombre)

    const form = useForm({
        defaultValues: getInitialValues(firstRol),
        onSubmit: ({value}) => {
            onSubmit(value)
        },
    })
    return(
        <form
            onSubmit={(event)=> {
                event.preventDefault()
                form.handleSubmit()
            }}
        >
            <h3>{isEditando? 'Editar rol' : 'Nuevo rol'}</h3>
            <form.Field
                name = "nombre"
                validators={{
                    onChange: ({value}) => (!value?.trim() ? 'El nombre es requerido' : undefined),
                }}  
            >
                {(field)=> (
                    <div>
                        <label htmlFor='nombre'>Nombre</label>
                        <input
                            id='nombre'
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event)=> field.handleChange(event.target.value)}
                        />
                        {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
                    </div>
                )}
            </form.Field>
            <form.Field
                name = "descripcion"
                validators={{
                    onChange: ({value}) => (!value?.trim() ? 'La descripcion es requerida' : undefined),
                }}  
            >
                {(field)=> (
                    <div>
                        <label htmlFor='descripcion'>Descripcion</label>
                        <textarea
                            id='descripcion'
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event)=> field.handleChange(event.target.value)}
                        />
                        {field.state.meta.errors.length > 0 ? <small>{field.state.meta.errors[0]}</small> : null}
                    </div>
                )}
            </form.Field>
            <form.Field name = "permisosId">
                {(field) => (
                    <div>
                        <label>Permisos</label>
                        <div className='acc-permisos-grid'>
                            {catalogoPermisos.map((permiso)=>{
                                const checked = field.state.value.includes(permiso.id)
                                return (
                                    <label key={permiso.id} className='acc-permiso-item' title={permiso.descripcion}>
                                        <input
                                            type='checkbox'
                                            checked={checked}
                                            onChange={(event) => {
                                                const selected = event.target.checked
                                                const next= selected
                                                    ? [...field.state.value, permiso.id]
                                                    : field.state.value.filter((id)=> id !== permiso.id)
                                                field.handleChange(next)
                                            }}
                                        />
                                        {permiso.clave}
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                )}
            </form.Field>
            <div style={{ display: 'flex', gap: '8px'}}>
                <button type='submit'>Guardar</button>
                <button type='button' onClick={onCancelar}>
                    Cancelar
                </button>
            </div>
        </form>
    )
}