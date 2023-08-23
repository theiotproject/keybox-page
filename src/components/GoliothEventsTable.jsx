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

const CustomPaper = styled(Paper)`
  border: 0;
  border: 1px solid black;
  border-bottom: 0;
`;

const CutstomRow = styled(TableRow)`
  background-color: rgba(0, 0, 0, 0.26);
`;

function GoliothEventsTable({ keyboxData, disablePagination, compact }) {
  const CustomizedTableCell = styled(TableCell)`
    border-bottom: 1px solid black;
    ${compact ? "font-size: 1rem;" : "font-size: 1.3rem;"}
    ${compact && "padding: 0.5rem 1rem;"}
  `;
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
      `https://api.golioth.io/v1/projects/keybox/devices/${deviceId}/stream?interval=731h&encodedQuery=%7B%20%20%20%22fields%22%3A%20%5B%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22time%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%2C%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22deviceId%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%2C%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22timestamp%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%2C%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22newCard%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%2C%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22slotOpen%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%20%20%20%5D%2C%20%20%20%22filters%22%3A%20%5B%5D%20%7D&page=${
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
    if (keyboxData) {
      getKeyboxEventsData();
    }
  }, [page]);

  return (
    <>
      <TableContainer component={CustomPaper} variant="outlined" sx={{ mb: 3 }}>
        <Table aria-label="key slot table">
          <TableHead>
            <CutstomRow>
              <CustomizedTableCell align="center">Date</CustomizedTableCell>
              <CustomizedTableCell align="center">Action</CustomizedTableCell>
              <CustomizedTableCell align="center">Slot Id</CustomizedTableCell>
              <CustomizedTableCell align="center">Card Id</CustomizedTableCell>
            </CutstomRow>
          </TableHead>
          <TableBody>
            {(() => {
              if (isLoading) {
                [1, 2, 3].map((row, index) => (
                  <TableRow key={index}>
                    <CustomizedTableCell align="center">
                      <Skeleton animation="wave" />
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
                ));
              } else {
                if (eventsData && !("code" in eventsData)) {
                  if (eventsData.list?.length > 0) {
                    return (
                      <>
                        {eventsData.list.map((event, index) => (
                          <TableRow key={index}>
                            <CustomizedTableCell align="center">
                              <Tooltip
                                title={dayjs(event.timestamp).format("lll")}
                              >
                                <span>{dayjs(event.timestamp).fromNow()}</span>
                              </Tooltip>
                            </CustomizedTableCell>
                            <CustomizedTableCell align="center">
                              {event.newCard && "New Card Scanned"}
                              {event.slotOpen && "Slot Opened"}
                            </CustomizedTableCell>
                            <CustomizedTableCell align="center">
                              {event.slotOpen && event.slotOpen.split(",")[2]}
                            </CustomizedTableCell>
                            <CustomizedTableCell align="center">
                              {event.newCard && event.newCard.split(",")[1]}
                              {event.slotOpen && event.slotOpen.split(",")[1]}
                            </CustomizedTableCell>
                          </TableRow>
                        ))}
                      </>
                    );
                  } else {
                    return (
                      <TableRow>
                        <CustomizedTableCell align="center" colSpan={4}>
                          No events in this keybox
                        </CustomizedTableCell>
                      </TableRow>
                    );
                  }
                } else {
                  return (
                    <TableRow>
                      <CustomizedTableCell align="center" colSpan={4}>
                        This keybox is not connected with any hardware
                      </CustomizedTableCell>
                    </TableRow>
                  );
                }
              }
            })()}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid
        container
        justifyContent={"right"}
        marginBottom={"2em"}
        sx={disablePagination && { display: "none" }}
      >
        {(() => {
          if (eventsData) {
            if (eventsData.list?.length > 0) {
              return (
                <Pagination
                  count={Math.ceil(eventsData.total / 10)}
                  variant="outlined"
                  shape="rounded"
                  size="large"
                  onChange={handlePageChange}
                  page={page}
                />
              );
            } else {
              return (
                <Pagination
                  count={0}
                  variant="outlined"
                  shape="rounded"
                  size="large"
                  disabled
                  onChange={handlePageChange}
                  page={page}
                />
              );
            }
          }
        })()}
      </Grid>
    </>
  );
}

export default GoliothEventsTable;
