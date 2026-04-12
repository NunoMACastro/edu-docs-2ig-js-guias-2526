import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingState({ label = "A carregar dados meteorológicos..." }) {
    return (
        <div className="loading-state" role="status" aria-live="polite">
            <div className="state-title">
                <AiOutlineLoading3Quarters
                    className="state-icon state-icon--spin"
                    aria-hidden="true"
                />
                <strong>{label}</strong>
            </div>
        </div>
    );
}

export default LoadingState;
