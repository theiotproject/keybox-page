import { toast } from "react-toastify";

const showSuccess = (label="default success") => {
    toast.success(label, {
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

export default showSuccess;