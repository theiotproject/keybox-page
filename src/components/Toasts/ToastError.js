import { toast } from "react-toastify";

const showError = (label="default error") => {
    toast.error(label, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
}

export default showError;