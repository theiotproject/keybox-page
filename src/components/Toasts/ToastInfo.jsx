import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return <span onClick={() => navigate("cards")}>{label}</span>;
}

export default showInfo;
