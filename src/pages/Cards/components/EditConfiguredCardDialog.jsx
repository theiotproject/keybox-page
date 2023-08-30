import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Close, Delete as DeleteIcon, Edit } from "@mui/icons-material";
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

function EditConfiguredCardDialog({
  open,
  toggleDialog,
  cardData,
  refreshCards,
  ...props
}) {
  const [keyboxRef, setKeyboxRef] = useState();

  const [isLoading, setLoading] = useState(false);
  const [isCardEditMode, setCardEditMode] = useState(false);

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

  const toggleCardEditMode = () => {
    setCardEditMode(!isCardEditMode);
  };

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

    // firestore slots data
    const slotsCollectionQuery = query(
      slotsCollectionRef,
      where("authorizedCards", "array-contains", Number(data.cardId))
    );

    const slotsSnapshot = await getDocs(slotsCollectionQuery);

    const availableSlots = slotsSnapshot.docs.map((slot) => slot.id);

    const slotsAccessToDelete = availableSlots.filter(
      (availableSlot) => !authorizedSlotsToArray.includes(availableSlot)
    );

    // Adding slot access
    authorizedSlotsToArray.forEach((slotId) => {
      const editSlotData = {
        authorizedCards: arrayUnion(Number(data.cardId)),
      };
      updateDoc(doc(keyboxRef, "slots", slotId), editSlotData).catch(
        (error) => {
          showError(
            "Error while editing authorized slots, check console for more info"
          );
          console.error(error);
        }
      );
    });

    // Deleting slot access
    slotsAccessToDelete.forEach((slotId) => {
      const editSlotData = {
        authorizedCards: arrayRemove(Number(cardData.id)),
      };
      updateDoc(doc(keyboxRef, "slots", slotId), editSlotData).catch(
        (error) => {
          showError(
            "Error while editing authorized slots, check console for more info"
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

    const keyboxSnapshot = await getDoc(keyboxRef);

    // send log to keybox Events
    addUserEvent(
      keyboxRef,
      "configured card edited",
      keyboxSnapshot.data().keyboxId,
      "-",
      cardData.id
    );

    await updateSlotsPrivilagesToGoliothState(keyboxRef);

    updateDoc(doc(keyboxRef, "cards", cardData.id), editCardData)
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

    if (slotIdArray.length) {
      slotIdArray.forEach((slotId) => {
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

    const keyboxSnapshot = await getDoc(keyboxRef);

    // send log to keybox Events
    addUserEvent(
      keyboxRef,
      "configured card deleted",
      keyboxSnapshot.data().keyboxId,
      "-",
      cardData.id
    );

    await updateSlotsPrivilagesToGoliothState(keyboxRef);

    deleteDoc(doc(keyboxRef, "cards", cardId))
      .catch((error) => {
        showError("Error while deleting card, check console for more info");
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
          <DialogTitle>Edit configured card</DialogTitle>
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
                sx={{
                  width: "50%",
                }}
                variant="standard"
                id="cardId"
                name="cardId"
                label="Card Id"
                defaultValue={cardData.id}
                {...register("cardId")}
                error={!!errors.cardId}
                helperText={errors.cardId?.message}
                disabled={!isCardEditMode}
              />
              <TextField
                sx={{
                  width: "50%",
                }}
                variant="standard"
                id="cardName"
                name="cardName"
                label="Card Name"
                defaultValue={cardData.data().cardName}
                {...register("cardName")}
                error={!!errors.cardName}
                helperText={errors.cardName?.message}
                disabled={!isCardEditMode}
              />
              {/* Group select */}
              {/* <CustomFormSelect
                disabled={!isCardEditMode}
                selectedValue={cardData.data().group}
                setSelectedGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
              /> */}

              <CustomFormMultipleSelect
                disabled={!isCardEditMode}
                cardId={cardData.id}
                keyboxRef={keyboxRef}
                setSelectedSlots={setSelectedSlots}
                selectedSlots={selectedSlots}
              />

              <DialogActions
                disableSpacing
                sx={{
                  display: "grid",
                  gridTemplateColumns: "30px 150px 150px",
                  columnGap: "1em",
                }}
              >
                <IconButton
                  aria-label="delete"
                  variant="contained"
                  sx={{ aspectRatio: "1/1" }}
                  onClick={() => handleDeleteCard(cardData.id)}
                >
                  <DeleteIcon />
                </IconButton>
                {!isCardEditMode ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => toggleCardEditMode()}
                  >
                    Edit Card
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<Close />}
                    onClick={() => toggleCardEditMode()}
                    color="error"
                  >
                    Stop Edit
                  </Button>
                )}

                {isCardEditMode ? (
                  <Button variant="contained" type="submit">
                    Submit & Close
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      toggleDialog();
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default EditConfiguredCardDialog;
