import { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";

import showError from "src/components/Toasts/ToastError";
import showInfo from "src/components/Toasts/ToastInfo";
import showSuccess from "src/components/Toasts/ToastSuccess";
import AddNewKeybox from "src/pages/Dashboard/components/AddNewKeybox";
import DeviceCard from "src/pages/Dashboard/components/DeviceCard";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuthProvider();

  useEffect(() => {
    setLoading(true);
    const keyboxCollectionRef = collection(db, "keyboxes");

    const keyboxQuery = query(
      keyboxCollectionRef,
      where("ownerId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(keyboxQuery, (snapshot) => {
      // Clear data to prevent data duplication of data,
      // which appears because onSnapshot runs every time user activates window
      // or does any action connected with data
      setData([]);
      snapshot.docs.forEach((doc) => {
        setData((prevData) => [...prevData, { docId: doc.id, ...doc.data() }]);
      });
      setLoading(false);
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const testGoliothApi = async () => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-Key", import.meta.env.VITE_GOLIOTH_API_KEY);

    const myInit = {
      method: "GET",
      headers: myHeaders,
    };

    await fetch(
      "https://api.golioth.io/v1/projects/test-e47c2d/devices",
      myInit
    )
      .catch((error) => {
        showError(
          `Error while sending query to Golioth, check console for more info`
        );
        console.error(error);
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        showSuccess(
          `Working device: ${data.list[0].name}, check console for more info`
        );
        console.log(data.list);
      });
  };

  // Simulate websocket behaviour
  const [timerId, setTimerId] = useState(0);
  // Function to send a message to the client
  const sendMessageToClient = () => {
    showInfo("New card is pending, configure it now!");
  };

  const toggleWebSocketSimulation = () => {
    // Call the sendMessageToClient function initially

    if (timerId === 0) {
      // Set up a timer to simulate the periodic message sending (every 5 seconds)
      const timerIdLocal = setInterval(sendMessageToClient, 1000);
      setTimerId(timerIdLocal);
    } else {
      setTimerId(0);
      clearInterval(timerId);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, m: 5 }}>
        Your Key Boxes
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <AddNewKeybox />
        <Card
          sx={{
            width: 275,
            maxWidth: { sx: "100%", sm: 275 },
            backgroundColor: "#E9E9EF",
            height: "18rem",
            border: "1px solid #B6B6BB",
            m: 2,
          }}
        >
          <CardContent sx={{ height: "100%" }}>
            <Typography variant="h1" sx={{ fontSize: 20 }}>
              Przetestuj Golioth'a
            </Typography>
            <Box sx={{ display: "grid", placeItems: "center", height: "75%" }}>
              <Button onClick={testGoliothApi} variant="contained">
                Test api
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: 275,
            maxWidth: { sx: "100%", sm: 275 },
            backgroundColor: "#E9E9EF",
            height: "18rem",
            border: "1px solid #B6B6BB",
            m: 2,
          }}
        >
          <CardContent sx={{ height: "100%" }}>
            <Typography variant="h1" sx={{ fontSize: 20 }}>
              Przetestuj WebSocket
            </Typography>
            <Box sx={{ display: "grid", placeItems: "center", height: "75%" }}>
              <Button
                onClick={() => toggleWebSocketSimulation()}
                variant="contained"
              >
                Test websocket
              </Button>
            </Box>
          </CardContent>
        </Card>
        {!loading ? (
          data &&
          data.map((item) => (
            <DeviceCard
              key={item.deviceId}
              docId={item.docId}
              deviceId={item.deviceId}
              ownerId={item.ownerId}
              deviceName={item.deviceName}
              deviceStatus={item.deviceStatus}
            />
          ))
        ) : (
          <CircularProgress />
        )}
      </Box>
    </>
  );
}

export default Dashboard;
