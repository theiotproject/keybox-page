import { useEffect, useLayoutEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";

import AddNewDevice from "src/components/AddNewDevice";
import DeviceCard from "src/components/DeviceCard";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuthProvider();
  useLayoutEffect(() => {
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
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert(
          `Dostępne urządzenie: ${data.list[0].name}, po więcej informacji sprawdź konsolę`
        );
        console.log(data.list);
      });
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
        <AddNewDevice />
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
              <Button onClick={() => testGoliothApi()} variant="contained">
                Test api
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
