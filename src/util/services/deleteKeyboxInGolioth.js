import showError from "src/components/Toasts/ToastError";
import showSuccess from "src/components/Toasts/ToastSuccess";

export const deleteKeyboxInGolioth = async (keyboxId) => {
  const myHeaders = new Headers();
  myHeaders.append("X-API-Key", import.meta.env.VITE_GOLIOTH_API_KEY);

  const myInit = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify([0]),
  };
  await fetch(
    `https://api.golioth.io/v1/projects/keybox/devices/${keyboxId}/data/acl`,
    myInit
  )
    .catch((error) => {
      showError(
        `Error while sending query to Golioth, check console for more info`
      );
      console.error(error);
    })
    .then(() => {
      showSuccess("Golioth success");
    });
};
