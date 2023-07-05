import { CircularProgress } from "@mui/material";

function LoadingScreen() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <CircularProgress />
    </div>
  );
}

export default LoadingScreen;
