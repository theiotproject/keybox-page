import React, { useEffect, useState } from "react";

import { CreditCard } from "@mui/icons-material";
import { Chip } from "@mui/material";

import showError from "src/components/Toasts/ToastError";

import styled from "@emotion/styled";
import {
  arrayRemove,
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

import EditPendingCardDialog from "./EditPendingCardDialog";

function PendingCardChip({ cardData, size = 1.6, refreshCards, ...props }) {
  const StyledChip = styled(Chip)(() => ({
    "& .MuiChip-label": {
      fontSize: `${size * 0.8125}rem`,
    },
    "& .MuiChip-deleteIcon": {
      height: `${size * 22}px`,
      width: `${size * 22}px`,
    },
    "& .MuiChip-icon": {
      height: `${size * 22}px`,
      width: `${size * 22}px`,
    },
  }));

  const [open, setOpen] = useState(false);
  const [keyboxRef, setKeyboxRef] = useState();

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const handleDeleteCard = async (cardId) => {
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

  return (
    <>
      <StyledChip
        sx={{
          height: `${size * 32}px`,
          display: "flex",
          justifyContent: "space-between",
        }}
        label={cardData.data().cardName}
        variant="outlined"
        onClick={handleDialogToggle}
        onDelete={() => handleDeleteCard(cardData.id)}
        icon={<CreditCard />}
      />
      <EditPendingCardDialog
        open={open}
        toggleDialog={handleDialogToggle}
        cardData={cardData}
        keyboxRef={keyboxRef}
        refreshCards={refreshCards}
      />
    </>
  );
}

export default PendingCardChip;
