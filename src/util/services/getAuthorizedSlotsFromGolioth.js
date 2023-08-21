import showError from "src/components/Toasts/ToastError";
import showSuccess from "src/components/Toasts/ToastSuccess";

export const getAuthorizedSlotsFromGolioth = async (keyboxId, cardId) => {
  const myHeaders = new Headers();
  myHeaders.append("X-API-Key", import.meta.env.VITE_GOLIOTH_API_KEY);

  const myInit = {
    method: "GET",
    headers: myHeaders,
  };
  const response = await fetch(
    `https://api.golioth.io/v1/projects/keybox/devices/${keyboxId}/data/${cardId}`,
    myInit
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      showError(
        `Error while sending query to Golioth, check console for more info`
      );
      console.error(error);
    });

  return response;
};
