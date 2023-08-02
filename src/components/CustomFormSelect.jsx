import * as React from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function CustomFormSelect({ disabled }) {
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mt: 2, maxWidth: "32ch" }}>
      <InputLabel id="groupName-label">Group</InputLabel>
      <Select
        labelId="groupName"
        id="groupName"
        value=""
        label="groupName"
        onChange={handleChange}
        disabled={disabled}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="moderator">Moderator</MenuItem>
        <MenuItem value="forklift operator">Forklift Operator</MenuItem>
      </Select>
    </FormControl>
  );
}

export default CustomFormSelect;
