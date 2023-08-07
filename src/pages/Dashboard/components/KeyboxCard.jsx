import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CircularProgress,
  IconButton,
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import showError from "src/components/Toasts/ToastError";

import { yupResolver } from "@hookform/resolvers/yup";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { editKeyboxValidationSchema } from "src/util/validation/editKeyboxValidationSchema";

function KeyboxCard({ ...props }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = useState(false);
  const { currentUser } = useAuthProvider();

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editKeyboxValidationSchema),
  });

  const handleEditKeybox = async (data) => {
    setLoading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxDocRef = doc(userDocRef, "keyboxes", props.docId);

    // Back off from sending reqeuest if user haven't changed anything
    if (data.keyboxName == props.keyboxName) {
      setLoading(false);
      handleDialogToggle(false);
      return;
    }

    const editKeyboxQuery = {
      keyboxId: props.keyboxId,
      keyboxName: data.keyboxName,
    };

    setDoc(keyboxDocRef, editKeyboxQuery)
      .catch((error) => {
        showError("Error while updating keybox, check console for more info");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        handleDialogToggle();
      });
  };

  const handleDeleteKeybox = async () => {
    setLoading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxDocRef = doc(userDocRef, "keyboxes", props.docId);
    await deleteDoc(keyboxDocRef);
    setLoading(false);
  };

  return (
    <>
      <Card
        sx={{
          width: 275,
          maxWidth: { sx: "100%", sm: 275 },
          backgroundColor: "#FFF",
          height: "18rem",
          border: "1px solid #B6B6BB",
          alignContent: "center",
          m: 2,
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: 20,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
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
              height: "85%",
            }}
          >
            <Card
              sx={{
                width: "100%",
                p: 0.5,
                pl: 1.5,
                mt: 1,
                boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.20)",
              }}
            >
              <Typography
                sx={{
                  color: "#5A5A5F",
                  fontSize: "1rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                id number
              </Typography>
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: "1.7rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {props.keyboxId}
              </Typography>
            </Card>

            <Button
              variant="outlined"
              onClick={handleDialogToggle}
              sx={{ mt: 3, border: 1.5 }}
            >
              Edit keybox
            </Button>
          </Box>
        </CardContent>
      </Card>
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Edit keybox</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleDialogToggle}>
          <DialogTitle>Edit keybox</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can change the keybox name!
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleEditKeybox)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="keyboxName"
                name="keyboxName"
                label="Keybox Name"
                defaultValue={props.keyboxName}
                {...register("keyboxName")}
                error={!!errors.keyboxName}
                helperText={errors.keyboxName?.message}
                fullWidth
                variant="standard"
                sx={{ mt: 2 }}
              />
              <DialogActions>
                <IconButton aria-label="delete" onClick={handleDeleteKeybox}>
                  <DeleteIcon />
                </IconButton>
                <Button variant="outlined" onClick={handleDialogToggle}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default KeyboxCard;
