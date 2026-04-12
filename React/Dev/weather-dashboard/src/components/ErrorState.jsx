import { MdOutlineWarningAmber } from "react-icons/md";

function ErrorState({ message, onRetry }) {
    return (
        <div className="error-state" role="alert">
            <div className="state-title">
                <MdOutlineWarningAmber
                    className="state-icon state-icon--danger"
                    aria-hidden="true"
                />
                <strong>Ocorreu um problema.</strong>
            </div>
            <p>{message}</p>
            <button className="error-state__button" type="button" onClick={onRetry}>
                Tentar novamente
            </button>
        </div>
    );
}

export default ErrorState;
