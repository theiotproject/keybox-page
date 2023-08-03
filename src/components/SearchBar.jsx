import React, { useEffect, useMemo, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: "8.5px 14px 8.5px",
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function SearchBar({ itemListArray, setFilteredResults }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Search sx={{ display: "flex", alignItems: "center" }}>
      <SearchIconWrapper>
        <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.54)", height: "unset" }} />
      </SearchIconWrapper>
      <StyledInputBase
        sx={{
          border: "1px solid lightGray",
          borderRadius: "4px",
        }}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
    </Search>
  );
}

export default SearchBar;
