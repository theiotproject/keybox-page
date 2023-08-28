import { useEffect, useState } from "react";

import { Skeleton } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { doc, getDoc } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function CustomFormSelect({
  disabled,
  selectedValue = "",
  selectedGroup,
  setSelectedGroup,
}) {
  const { currentUser } = useAuthProvider();
  const [groups, setGroups] = useState();

  const getMenuItems = async () => {
    const userDocRef = doc(db, "users", currentUser.uid);

    const userSnapshot = await getDoc(userDocRef);

    setGroups(userSnapshot.data().groups);
  };

  const handleChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  useEffect(() => {
    setSelectedGroup(selectedValue);
    getMenuItems();
  }, []);

  return (
    <FormControl>
      <InputLabel id="groupName-label">Group</InputLabel>
      <Select
        labelId="groupName"
        id="groupName"
        value={groups ? selectedGroup : ""}
        label="groupName"
        onChange={handleChange}
        disabled={disabled}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {!groups && (
          <Skeleton animation="wave" sx={{ width: "80%", marginLeft: "1em" }} />
        )}
        {groups &&
          groups.map((group, index) => (
            <MenuItem value={group} key={group}>
              {group}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default CustomFormSelect;
