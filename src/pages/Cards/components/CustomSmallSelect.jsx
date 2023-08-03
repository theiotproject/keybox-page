import * as React from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function CustomSmallSelect() {
  const [category, setCategory] = React.useState("");
  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="select-category-label">Age</InputLabel>
      <Select
        labelId="select-category-label"
        id="category"
        value={category}
        label="Category"
        onChange={handleChange}
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

export default CustomSmallSelect;
