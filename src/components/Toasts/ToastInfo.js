import { toast } from "react-toastify";

const showInfo = (label="default info") => {
    toast.info(label, {
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

export default showInfo;