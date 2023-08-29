import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CardActions,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import showError from "src/components/Toasts/ToastError";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { editKeyboxValidationSchema } from "src/util/validation/editKeyboxValidationSchema";

function KeyboxCard({ ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editKeyboxValidationSchema),
  });

  const [slotsData, setSlotsData] = useState();
  const [isLoading, setLoading] = useState(false);

  const getSlotsData = async (docRef) => {
    setLoading(true);
    const slotsCollectionRef = collection(docRef, "slots");
    const slotsData = await getDocs(slotsCollectionRef);

    setSlotsData(slotsData.docs);
    setLoading(false);
  };

  useEffect(() => {
    if (props.docRef) getSlotsData(props.docRef);
  }, [props.docRef]);

  return (
    <>
      <Card
        sx={{
          minWidth: "216px",
          maxWidth: "216px",
          backgroundColor: "#FFF",
          minHeight: "15.5rem",
          border: "1px solid #B6B6BB",
          alignContent: "center",
          m: 2,
          position: "relative",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "30px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              marginY: 2,
            }}
          >
            {props.keyboxName}
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>
                active slots: {slotsData ? slotsData.length : <Skeleton />}
              </Typography>
              <Divider sx={{ border: "1px solid gray", marginY: 1.5 }} />
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  fontSize: "14px",
                }}
              >
                {isLoading && <Skeleton />}
                {slotsData &&
                  slotsData.length > 0 &&
                  slotsData.map((slot, index) => {
                    if (index == slotsData.length - 1) {
                      return slot.data().slotName;
                    } else {
                      return slot.data().slotName + ", ";
                    }
                  })}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              flexGrow: "1",
            }}
          >
            <Button
              variant="outlined"
              href={`/keyboxes/${props.keyboxName}`}
              sx={{ mt: "1.5em" }}
            >
              Manage
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default KeyboxCard;
