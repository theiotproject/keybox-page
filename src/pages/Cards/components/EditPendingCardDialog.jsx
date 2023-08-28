import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Add, AddCard, Close, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

import showError from "src/components/Toasts/ToastError";
import showSuccess from "src/components/Toasts/ToastSuccess";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { addUserEvent } from "src/util/services/addUserEvent";
import { updateSlotsPrivilagesToGoliothState } from "src/util/services/updateSlotsPrivilagesToGoliothState";
import { editCardValidationSchema } from "src/util/validation/editCardValidationSchema";

import CustomFormMultipleSelect from "./CustomFormMultipleSelect";
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

  // const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editCardValidationSchema),
  });

  const handleEditCard = async (data) => {
    setLoading(true);

    const slotsCollectionRef = collection(keyboxRef, "slots");
    const selectedSlotsCollectionQuery = query(
      slotsCollectionRef,
      where("slotName", "in", selectedSlots)
    );
    const selectedSlotsSnapshot = await getDocs(selectedSlotsCollectionQuery);

    const authorizedSlotsToArray = selectedSlotsSnapshot.docs.map(
      (slot) => slot.id
    );

    authorizedSlotsToArray.forEach(async (slotId) => {
      const editSlotData = {
        authorizedCards: arrayUnion(Number(cardData.id.replace(",", "."))),
      };
      await updateDoc(doc(keyboxRef, "slots", slotId), editSlotData).catch(
        (error) => {
          showError(
            `Error while editing authorized slots, slot ${slotId} doesn't exist, but got authorized anyway, check console for more info`
          );
          console.error(error);
        }
      );
    });

    const editCardData = {
      cardName: data.cardName,
      isPending: false,
      // group: selectedGroup,
    };

    await updateSlotsPrivilagesToGoliothState(keyboxRef);

    const keyboxSnapshot = await getDoc(keyboxRef);

    // send log to keybox Events
    addUserEvent(
      keyboxRef,
      "pending card edited",
      keyboxSnapshot.data().keyboxId,
      "-",
      cardData.id
    );

    updateDoc(doc(keyboxRef, "cards", cardData.id), editCardData)
      .catch((error) => {
        showError("Error while editing card, check console for more info");
        console.error(error);
        return;
      })
      .finally(() => {
        reset();
        refreshCards();
        setLoading(false);
        toggleDialog();
      });
  };

  const handleDeleteCard = async (cardId) => {
    setLoading(true);

    const slotsColletionRef = collection(keyboxRef, "slots");
    const cardApperedInSlotQuery = query(
      slotsColletionRef,
      where("authorizedCards", "array-contains", Number(cardData.id))
    );

    const cardApperedInSlotSnapshot = await getDocs(cardApperedInSlotQuery);

    const slotIdArray = cardApperedInSlotSnapshot.docs.map((slot) => slot.id);

    const editSlotData = {
      authorizedCards: arrayRemove(Number(cardId)),
    };

    if (slotIdArray.length > 0) {
      slotIdArray.forEach((slotId) => {
        console.log(slotId);
        updateDoc(doc(keyboxRef, "slots", slotId), editSlotData).catch(
          (error) => {
            showError(
              "Error while updating slots authorized Cards, check console for more info"
            );
            console.error(error);
          }
        );
      });
    }

    deleteDoc(doc(keyboxRef, "cards", cardId))
      .catch((error) => {
        showError("Error while deleting card, check console for more info");
        console.error(error);
      })
      .finally(() => {
        refreshCards();
        setLoading(false);
        reset();
        toggleDialog();
      });

    const keyboxSnapshot = await getDoc(keyboxRef);

    // send log to keybox Events
    addUserEvent(
      keyboxRef,
      "pending card deleted",
      keyboxSnapshot.data().keyboxId,
      "-",
      cardData.id
    );
  };

  useEffect(() => {
    setKeyboxRef(props.keyboxRef);
  }, [props.keyboxRef]);

  useEffect(() => {
    if (cardData) {
      setValue("cardId", cardData.id);
      setValue("cardName", cardData.data().cardName);
    }
  }, [cardData, selectedSlots]);

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
              fontSize: "30px",
              lineHeight: "30px",
              fontWeight: "bold",
              alignItems: "center",
              color: "#121212",
              marginY: "1em",
            }}
          >
            Configure Card
          </DialogTitle>
          <DialogContent>
            <Box
              component="form"
              noValidate
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                rowGap: "1em",
              }}
              onSubmit={handleSubmit(handleEditCard)}
            >
              <TextField
                id="cardId"
                name="cardId"
                label="Card Id"
                defaultValue={cardData.id}
                {...register("cardId")}
                error={!!errors.cardId}
                helperText={errors.cardId?.message}
                variant="standard"
                sx={{
                  width: "50%",
                }}
                disabled
              />
              <TextField
                id="cardName"
                name="cardName"
                label="Card Name"
                defaultValue={cardData.data().cardName}
                {...register("cardName")}
                error={!!errors.cardName}
                helperText={errors.cardName?.message}
                variant="standard"
                sx={{ width: "50%" }}
              />

              {/* <CustomFormSelect
                selectedValue={cardData.data().group}
                setSelectedGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
              /> */}

              <CustomFormMultipleSelect
                cardId={cardData.id}
                keyboxRef={keyboxRef}
                setSelectedSlots={setSelectedSlots}
                selectedSlots={selectedSlots}
              />

              <DialogActions
                sx={{
                  display: "grid",
                  gridTemplateColumns: "30px 150px 150px",
                  columnGap: "1em",
                }}
              >
                <IconButton
                  aria-label="delete"
                  variant="contained"
                  onClick={() => handleDeleteCard(cardData.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <Button variant="outlined" onClick={toggleDialog}>
                  Close
                </Button>
                <Button variant="contained" startIcon={<Add />} type="submit">
                  Add Card
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
