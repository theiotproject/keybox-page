import React, { useEffect, useState } from "react";

import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import styled from "@emotion/styled";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

// extend dayjs to use relativeTime formatter and locialized format
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const CustomizedTableCell = styled(TableCell)`
  font-size: 1.3rem;
  border-bottom: 1px solid black;
`;

const CustomPaper = styled(Paper)`
  border: 0;
  border: 1px solid black;
  border-bottom: 0;
`;

const CutstomRow = styled(TableRow)`
  background-color: rgba(0, 0, 0, 0.26);
`;

function EventTable() {
  const [date, setDate] = useState();
  const [isLoading, setLoading] = useState(false);

  const [eventsData, setEventsData] = useState([
    {
      action: "new card appeared",
      cardId: "123",
      slotId: "1231",
      timestamp: 1692008057,
    },
  ]);

  useEffect(() => {
    const date = dayjs.unix(1692008057).fromNow();
    setDate(date);
  }, []);

  return (
    <TableContainer component={CustomPaper} variant="outlined" sx={{ mb: 3 }}>
      <Table aria-label="key slot table">
        <TableHead>
          <CutstomRow>
            <CustomizedTableCell align="center">Date</CustomizedTableCell>
            <CustomizedTableCell align="center">Slot Id</CustomizedTableCell>
            <CustomizedTableCell align="center">Action</CustomizedTableCell>
            <CustomizedTableCell align="center">Card Id</CustomizedTableCell>
          </CutstomRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              {[1, 2, 3].map((row, index) => (
                <TableRow key={index}>
                  <CustomizedTableCell align="center">
                    {date}
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    <Skeleton animation="wave" />
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    <Skeleton animation="wave" />
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    <Skeleton animation="wave" />
                  </CustomizedTableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <>
              {eventsData.map((event, index) => (
                <TableRow key={index}>
                  <CustomizedTableCell align="center">
                    <Tooltip title={dayjs.unix(event.timestamp).format("lll")}>
                      <span>{dayjs.unix(event.timestamp).fromNow()}</span>
                    </Tooltip>
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    {event.slotId}
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    {event.action}
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    {event.cardId}
                  </CustomizedTableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventTable;
