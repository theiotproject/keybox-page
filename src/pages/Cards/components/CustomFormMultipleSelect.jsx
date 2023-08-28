import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";

import { collection, getDocs, query, where } from "firebase/firestore";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(slot, selectedSlots, theme) {
  return {
    fontWeight:
      selectedSlots.indexOf(slot) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function CustomFormMultipleSelect(props) {
  const theme = useTheme();
  const [slots, setSlots] = useState([]);

  const [keyboxRef, setKeyboxRef] = useState();
  const [cardId, setCardId] = useState();

  const fetchAuthorizedSlots = async (keyboxRef, cardId) => {
    const slotsCollectionRef = collection(keyboxRef, "slots");

    const slotsCollectionQuery = query(
      slotsCollectionRef,
      where("authorizedCards", "array-contains", Number(cardId))
    );

    const authorizedSlots = await getDocs(slotsCollectionQuery);

    const updatedSelectedSlots = authorizedSlots.docs.map(
      (slot) => slot.data().slotName
    );

    props.setSelectedSlots(updatedSelectedSlots);
  };

  const fetchSlots = async (keyboxRef) => {
    const slotsCollectionRef = collection(keyboxRef, "slots");
    const slots = await getDocs(slotsCollectionRef);

    const updatedSlots = slots.docs.map((slot) => slot.data().slotName);
    setSlots(updatedSlots);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    props.setSelectedSlots(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    setKeyboxRef(props.keyboxRef);
    setCardId(props.cardId);
  }, [props.keyboxRef, props.cardId]);

  useEffect(() => {
    if (keyboxRef && cardId) {
      fetchSlots(keyboxRef);
      fetchAuthorizedSlots(keyboxRef, cardId);
    }
  }, [keyboxRef, cardId]);

  return (
    <div>
      <FormControl fullWidth sx={{ mt: 2, minWidth: "306.33px" }}>
        <InputLabel id="authorizedSlotsLabel">Chip</InputLabel>
        <Select
          disabled={props.disabled}
          labelId="authorizedSlots"
          id="authorizedSlots"
          multiple
          value={props.selectedSlots}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {slots.length > 0 &&
            slots.map((slot) => (
              <MenuItem
                key={slot}
                value={slot}
                style={getStyles(slot, props.selectedSlots, theme)}
              >
                {slot}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
