import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Paper,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  useFileListing,
  UseFilterListingOutput,
} from '../hooks/useFileListing';

export const FileListingTable = () => {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [fileItems, setFileItems] = useState<UseFilterListingOutput['files']>(
    []
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { loading, error, getData, downloadDICOMFile } = useFileListing();

  useEffect(() => {
    const setup = async () => {
      const data: UseFilterListingOutput = await getData(page, pageSize);
      setCount(data.count ?? count);
      setFileItems(data.files);
    };
    setup();
  }, [page, pageSize]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('fileListingPage.listingTable.fetchError'), {
        variant: 'error',
      });
    }
  }, [error]);

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {t('fileListingPage.listingTable.patientNameColumn')}
              </TableCell>
              <TableCell>
                {t('fileListingPage.listingTable.patientBirthDateColumn')}
              </TableCell>
              <TableCell>
                {t('fileListingPage.listingTable.seriesDescriptionColumn')}
              </TableCell>
              <TableCell>
                {t('fileListingPage.listingTable.downloadColumn')}
              </TableCell>
              <TableCell>
                {t('fileListingPage.listingTable.previewColumn')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={100} height={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={100} height={40} />
                    </TableCell>
                  </TableRow>
                ))
              : fileItems.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.patientName}</TableCell>
                    <TableCell>{row.patientBirthDate}</TableCell>
                    <TableCell>{row.seriesDescription}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => downloadDICOMFile(row.id, row.fileName)}
                      >
                        {t('fileListingPage.listingTable.downloadColumn')}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/file-preview/${row.id}`)}
                      >
                        {t('fileListingPage.listingTable.previewColumn')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={count}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
