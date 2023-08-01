import React from "react";
import { toast } from "react-toastify";

const showInfo = (label = "default info") => {
  toast.info(<ToastInfoComponent label={label} />, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

function ToastInfoComponent({ label }) {
  return (
    <span
      onClick={() =>
        console.log("tutaj nastąpi przekierowanie do inicjalizacji keyboxa")
      }
    >
      {label}
    </span>
  );
}

export default showInfo;
