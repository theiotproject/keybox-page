import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Close,
  CreditCard,
  Delete as DeleteIcon,
  Edit,
} from "@mui/icons-material";
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
import { deleteCardInGolioth } from "src/util/services/deleteCardInGolioth";
import { getAuthorizedSlotsFromGolioth } from "src/util/services/getAuthorizedSlotsFromGolioth";
import { sendCardUpdateToGolioth } from "src/util/services/sendCardUpdateToGolioth";
import { editCardValidationSchema } from "src/util/validation/editCardValidationSchema";

import CustomFormSelect from "./CustomFormSelect";

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

  const [selectedGroup, setSelectedGroup] = useState("");
  const [authorizedSlots, setAuthorizedSlots] = useState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editCardValidationSchema),
  });

  const toggleCardEditMode = () => {
    setCardEditMode(!isCardEditMode);
    reset();
  };

  const getAuthorizedSlots = async (cardId) => {
    const keyboxData = await getDoc(keyboxRef);
    const authorizedSlotsArray = await getAuthorizedSlotsFromGolioth(
      keyboxData.data().keyboxId,
      cardId
    );

    if (authorizedSlotsArray.data.length > 0)
      setAuthorizedSlots(authorizedSlotsArray.data.join(", "));
  };

  const handleEditCard = async (data) => {
    setLoading(true);

    console.log(data, cardData.id);
    // user input
    const authorizedSlotsToArray = data.authorizedSlots
      .replaceAll(" ", "")
      .split(",");

    // firesotre slots data
    const slotsCollectionRef = collection(keyboxRef, "slots");
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
      group: selectedGroup,
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

    const keyboxData = await getDoc(keyboxRef);

    await sendCardUpdateToGolioth(
      keyboxData.data().keyboxId,
      cardData.id,
      authorizedSlotsToArray
    );

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

    const keyboxSnapshot = await getDoc(keyboxRef);

    // send log to keybox Events
    addUserEvent(
      keyboxRef,
      "configured card deleted",
      keyboxSnapshot.data().keyboxId,
      "-",
      cardData.id
    );

    const keyboxData = await getDoc(keyboxRef);
    await deleteCardInGolioth(keyboxData.data().keyboxId, cardId);

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
    if (keyboxRef) {
      getAuthorizedSlots(cardData.id);
    }
  }, [cardData, keyboxRef]);

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
              fontSize: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Card Profile
            <CreditCard sx={{ fontSize: "3em" }} />
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
                disabled={!isCardEditMode}
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
                disabled={!isCardEditMode}
              />
              <CustomFormSelect
                disabled={!isCardEditMode}
                selectedValue={cardData.data().group}
                setSelectedGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
              />

              <TextField
                id="authorizedSlots"
                name="authorizedSlots"
                label="Authorized Slots"
                {...register("authorizedSlots")}
                value={authorizedSlots || ""}
                onChange={(e) => setAuthorizedSlots(e.target.value)}
                error={!!errors.authorizedSlots}
                helperText={errors.authorizedSlots?.message}
                variant="outlined"
                sx={{ mt: 2 }}
                fullWidth
                disabled={!isCardEditMode}
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
                  startIcon={<DeleteIcon />}
                  color="error"
                  variant="contained"
                  sx={{ width: "100%", marginY: "2em" }}
                  onClick={() => handleDeleteCard(cardData.id)}
                >
                  Delete Card
                </Button>
                {!isCardEditMode ? (
                  <Button
                    variant="contained"
                    sx={{ width: "100%", marginY: "2em" }}
                    startIcon={<Edit />}
                    onClick={() => toggleCardEditMode()}
                  >
                    Edit Card
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ width: "100%", marginY: "2em" }}
                    startIcon={<Close />}
                    onClick={() => toggleCardEditMode()}
                    color="error"
                  >
                    Stop Edit
                  </Button>
                )}

                {isCardEditMode ? (
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      gridColumn: { sm: "1/-1" },
                      width: "100%",
                    }}
                  >
                    Submit & Close
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      toggleDialog();
                      getAuthorizedSlots(cardData.id);
                    }}
                    sx={{
                      gridColumn: { sm: "1/-1" },
                      width: "100%",
                    }}
                  >
                    Close
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
