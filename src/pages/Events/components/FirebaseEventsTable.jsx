import React, { useEffect, useState } from "react";

import {
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

import styled from "@emotion/styled";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

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

function FirebaseEventsTable({ keyboxData }) {
  const { currentUser } = useAuthProvider();
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const [eventsData, setEventsData] = useState();

  const fetchUserEventsData = async (keyboxId) => {
    setLoading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxesCollectionRef = collection(userDocRef, "keyboxes");

    const keyboxDocQuery = query(
      keyboxesCollectionRef,
      where("keyboxId", "==", keyboxId)
    );
    const keyboxDocRefSnapshot = await getDocs(keyboxDocQuery);
    const userEventsCollection = query(
      collection(keyboxDocRefSnapshot.docs[0].ref, "userEvents"),
      orderBy("timestamp", "desc")
    );

    const userEventsSnapshots = await getDocs(userEventsCollection).finally(
      () => setLoading(false)
    );

    setEventsData(userEventsSnapshots.docs);
  };

  const getKeyboxEventsData = () => {
    fetchUserEventsData(keyboxData.keyboxId);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (keyboxData) {
      getKeyboxEventsData();
    }
  }, [keyboxData]);

  return (
    <>
      <TableContainer component={CustomPaper} variant="outlined" sx={{ mb: 3 }}>
        <Table aria-label="key slot table">
          <TableHead>
            <CutstomRow>
              <CustomizedTableCell align="center">Date</CustomizedTableCell>
              <CustomizedTableCell align="center">Action</CustomizedTableCell>
              <CustomizedTableCell align="center">
                Keybox Id
              </CustomizedTableCell>
              <CustomizedTableCell align="center">Slot Id</CustomizedTableCell>
              <CustomizedTableCell align="center">Card Id</CustomizedTableCell>
            </CutstomRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <>
                {[1, 2, 3].map((row, index) => (
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
                    <CustomizedTableCell align="center">
                      <Skeleton animation="wave" />
                    </CustomizedTableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {eventsData &&
                  eventsData.length > 0 &&
                  eventsData
                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                    .map((event, index) => (
                      <TableRow key={index}>
                        <CustomizedTableCell align="center">
                          <Tooltip
                            title={dayjs
                              .unix(event.data().timestamp.seconds)
                              .format("lll")}
                          >
                            <span>
                              {dayjs
                                .unix(event.data().timestamp.seconds)
                                .fromNow()}
                            </span>
                          </Tooltip>
                        </CustomizedTableCell>
                        <CustomizedTableCell align="center">
                          {event.data().action}
                        </CustomizedTableCell>
                        <CustomizedTableCell align="center">
                          {event.data().keyboxId}
                        </CustomizedTableCell>
                        <CustomizedTableCell align="center">
                          {event.data().slotId}
                        </CustomizedTableCell>
                        <CustomizedTableCell align="center">
                          {event.data().cardId}
                        </CustomizedTableCell>
                      </TableRow>
                    ))}
                {eventsData && eventsData.length == 0 && (
                  <TableRow>
                    <CustomizedTableCell align="center" colSpan={5}>
                      No events in this keybox
                    </CustomizedTableCell>
                  </TableRow>
                )}
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
        {eventsData && eventsData.length > 0 ? (
          <Pagination
            count={Math.ceil(eventsData.length / 10)}
            variant="outlined"
            shape="rounded"
            size="large"
            onChange={handlePageChange}
            page={page}
          />
        ) : (
          <Pagination
            count={0}
            variant="outlined"
            shape="rounded"
            size="large"
            disabled
            onChange={handlePageChange}
            page={page}
          />
        )}
      </Grid>
    </>
  );
}

export default FirebaseEventsTable;
