import { toast } from "react-toastify";

const showWarning = (label="default warning") => {
    toast.warn(label, {
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

export default showWarning;