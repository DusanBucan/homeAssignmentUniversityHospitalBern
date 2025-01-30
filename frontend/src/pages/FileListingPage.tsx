import { Typography } from '@mui/material';
import { FileListingTable } from '../components/FileListingTable';
import { useTranslation } from 'react-i18next';

export const FileListingPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h4">{t('fileListingPage.title')}</Typography>
      <FileListingTable></FileListingTable>
    </>
  );
};
