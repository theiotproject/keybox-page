// import React, { useLayoutEffect, useState } from "react";

// import { Snackbar } from "@mui/material";
// import MuiAlert from "@mui/material/Alert";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// function AlertSnackbar({ type, message, open, setOpen }) {
//   useLayoutEffect(() => {
//     setOpen(open);
//   });

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }

//     setOpen("");
//   };

//   return (
//     <Snackbar
//       anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       open={!!open}
//       autoHideDuration={6000}
//       onClose={handleClose}
//     >
//       <Alert severity={type} onClose={handleClose}>
//         {message}
//       </Alert>
//     </Snackbar>
//   );
// }

// export default AlertSnackbar;
