import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Add, AddCard, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import showError from "src/components/Toasts/ToastError";

import { yupResolver } from "@hookform/resolvers/yup";
import { arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { editCardValidationSchema } from "src/util/validation/editCardValidationSchema";

import CustomFormSelect from "./CustomFormSelect";

function EditPendingCardDialog({
  open,
  toggleDialog,
  cardData,
  refreshCards,
  ...props
}) {
  const [isLoading, setLoading] = useState();
  const [keyboxRef, setKeyboxRef] = useState();

  const [authorizedSlots, setAuthorizedSlots] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editCardValidationSchema),
  });

  const handleEditCard = async (data) => {
    setLoading(true);

    const authorizedSlotsToArray = data.authorizedSlots
      .replaceAll(" ", "")
      .split(",");

    authorizedSlotsToArray.forEach((slotId) => {
      const editSlotQuery = {
        authorizedCards: arrayUnion(Number(cardData.id)),
      };
      updateDoc(doc(keyboxRef, "slots", slotId), editSlotQuery).catch(
        (error) => {
          showError(
            "Error while editing authorized slots, check console for more info"
          );
          console.error(error);
        }
      );
    });

    const editCardQuery = {
      cardName: data.cardName,
      isPending: false,
      group: selectedGroup,
    };

    updateDoc(doc(keyboxRef, "cards", cardData.id), editCardQuery)
      .catch((error) => {
        showError("Error while editing card, check console for more info");
        console.error(error);
      })
      .finally(() => {
        reset();
        refreshCards();
        setLoading(false);
        toggleDialog();
      });
  };

  useEffect(() => {
    setKeyboxRef(props.keyboxRef);
  }, [props.keyboxRef]);

  return (
    <>
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Edit pending card</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={toggleDialog}>
          <DialogTitle
            sx={{
              fontSize: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Configure Pending Card
            <AddCard sx={{ fontSize: "3em" }} />
          </DialogTitle>
          <DialogContent
            sx={{
              marginX: { xs: "unset", sm: "4em" },
            }}
          >
            <Box
              component="form"
              noValidate
              sx={{
                display: "grid",
                placeItems: "center",
              }}
              onSubmit={handleSubmit(handleEditCard)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="cardId"
                name="cardId"
                label="Card Id"
                defaultValue={cardData.id}
                {...register("cardId")}
                error={!!errors.cardId}
                helperText={errors.cardId?.message}
                fullWidth
                variant="outlined"
                sx={{ mt: 2, width: "100%" }}
                // disabled
              />
              <TextField
                autoFocus
                margin="dense"
                id="cardName"
                name="cardName"
                label="Card Name"
                defaultValue={cardData.data().cardName}
                {...register("cardName")}
                error={!!errors.cardName}
                helperText={errors.cardName?.message}
                fullWidth
                variant="outlined"
                sx={{ mt: 2, width: "100%" }}
              />

              <CustomFormSelect
                selectedValue={cardData.data().group}
                setSelectedGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
              />

              <TextField
                id="authorizedSlots"
                name="authorizedSlots"
                label="Authorized Slots"
                {...register("authorizedSlots")}
                error={!!errors.authorizedSlots}
                helperText={errors.authorizedSlots?.message}
                variant="outlined"
                sx={{ mt: 2 }}
                fullWidth
              />
              <em>Comma seperated</em>

              <DialogActions
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  columnGap: ".5em",
                }}
                disableSpacing
              >
                <Button
                  aria-label="delete"
                  startIcon={<Close />}
                  color="error"
                  variant="contained"
                  sx={{ width: "100%", marginY: "2em" }}
                >
                  Dismiss Card
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: "100%", marginY: "2em" }}
                  startIcon={<Add />}
                  type="submit"
                >
                  Add Card
                </Button>

                <Button
                  variant="outlined"
                  onClick={toggleDialog}
                  sx={{
                    gridColumn: { sm: "1/-1" },
                    width: "100%",
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default EditPendingCardDialog;
