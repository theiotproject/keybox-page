import React, { useEffect, useState } from "react";

import {
  Button,
  Grid,
  Pagination,
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

import showError from "src/components/Toasts/ToastError";
import showSuccess from "src/components/Toasts/ToastSuccess";

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

function EventTable({ keyboxData }) {
  const [date, setDate] = useState();
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const [eventsData, setEventsData] = useState();

  const fetchEventsData = async (deviceId) => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("X-API-Key", import.meta.env.VITE_GOLIOTH_API_KEY);

    const myInit = {
      method: "GET",
      headers: myHeaders,
    };

    await fetch(
      `https://api.golioth.io/v1/projects/keybox/devices/${deviceId}/stream?interval=731h&encodedQuery=%7B%22fields%22%3A%20%5B%7B%22path%22%3A%20%22timestamp%22%2C%22type%22%3A%20%22%22%7D%2C%7B%22path%22%3A%20%22deviceId%22%2C%22type%22%3A%20%22%22%7D%2C%7B%22path%22%3A%22newCard%22%2C%22type%22%3A%20%22%22%7D%5D%7D&page=${
        page - 1
      }&perPage=10`,
      myInit
    )
      .catch((error) => {
        showError(
          `Error while sending query to Golioth, check console for more info`
        );
        console.error(error);
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setEventsData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getKeyboxEventsData = () => {
    fetchEventsData(keyboxData.keyboxId);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (keyboxData) {
      getKeyboxEventsData();
    }
  }, [keyboxData]);

  useEffect(() => {
    getKeyboxEventsData();
  }, [page]);

  return (
    <>
      <Button onClick={() => getKeyboxEventsData()}>reload</Button>
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
                {eventsData &&
                  eventsData.list.length > 0 &&
                  eventsData.list.map((event, index) => (
                    <TableRow key={index}>
                      <CustomizedTableCell align="center">
                        <Tooltip title={dayjs(event.timestamp).format("lll")}>
                          <span>{dayjs(event.timestamp).fromNow()}</span>
                        </Tooltip>
                      </CustomizedTableCell>
                      <CustomizedTableCell align="center">
                        {/* {event.slotId} */}
                      </CustomizedTableCell>
                      <CustomizedTableCell align="center">
                        {/* {event.action} */}
                      </CustomizedTableCell>
                      <CustomizedTableCell align="center">
                        {event.newCard}
                      </CustomizedTableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justifyContent={"right"} marginBottom={"2em"}>
        {!eventsData && (
          <Pagination
            count={5}
            variant="outlined"
            shape="rounded"
            size="large"
          />
        )}
        {eventsData && (
          <Pagination
            count={Math.ceil(eventsData.total / 10)}
            variant="outlined"
            shape="rounded"
            size="large"
            onChange={handlePageChange}
            page={page}
          />
        )}
      </Grid>
    </>
  );
}

export default EventTable;
