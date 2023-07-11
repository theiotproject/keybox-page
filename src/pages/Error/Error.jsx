import { useRouteError } from "react-router-dom";

export default function Error({ errorCode, errorMessage }) {
  const routerError = useRouteError();

  return (
    <div
      id="error-page"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{routerError && (routerError.statusText || routerError.message)}</i>
        <i>{errorCode && (errorCode || errorMessage)}</i>
      </p>
    </div>
  );
}
