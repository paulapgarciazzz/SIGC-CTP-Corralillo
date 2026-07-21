export default function ActionsConfirm ({mensaje, onAceptar, onCancelar}){
    return(
        <div className="modal-overlay">
            <div className="modal-card">
                <p className="modal-text">{mensaje}</p>
                <div className="modal-actions">
                    <button className="modal-btn modal-btn--cancelar" onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button className="modal-btn modal-btn--aceptar" onClick={onAceptar}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    )
}