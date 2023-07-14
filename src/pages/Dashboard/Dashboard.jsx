import { useEffect, useLayoutEffect, useState } from "react";

import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";

import AddNewDevice from "src/components/AddNewDevice";
import DeviceCard from "src/components/DeviceCard";
import LoadingScreen from "src/components/LoadingScreen";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "src/backend/db_config";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "keyboxes"), (snapshot) => {
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

  return (
    <Container
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "flex-start",
        alignContent: "center",
        flexDirection: "column",
      }}
    >
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
    </Container>
  );
}

export default Dashboard;
