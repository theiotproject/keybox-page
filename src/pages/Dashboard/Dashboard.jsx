import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import Container from "@mui/material/Container";

import AddNewDevice from "src/components/AddNewDevice";
import DeviceCard from "src/components/DeviceCard";
import ErrorMsg from "src/components/ErrorMsg";
import LoadingScreen from "src/components/LoadingScreen";
import SignOutBtn from "src/components/SignOutBtn";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Dashboard() {
  const { currentUser } = useAuthProvider();

  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "keyboxes"), (snapshot) => {
      // Clear data to prevent data duplication of data,
      // which appears because onSnapshot runs every time user activates window
      // or does any action connected with data
      setData([]);
      snapshot.docs.forEach((doc) => {
        setData((prevData) => [...prevData, { docId: doc.id, ...doc.data() }]);
      });
    });

    console.log(data);

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, mt: 10 }}>
        Your Key devicees
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <AddNewDevice />
        {data &&
          data.map((item) => (
            <DeviceCard
              key={item.deviceId}
              docId={item.docId}
              deviceId={item.deviceId}
              ownerId={item.ownerId}
              deviceName={item.deviceName}
              deviceStatus={item.deviceStatus}
            />
          ))}
      </div>
      <SignOutBtn />
    </Container>
  );
}

export default Dashboard;
