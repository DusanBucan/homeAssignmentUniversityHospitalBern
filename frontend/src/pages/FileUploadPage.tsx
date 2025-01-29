import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FileUpload from '../components/FileUpload';

export const FileUploadPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {t('fileUploadPage.title')}
      </Typography>
      <FileUpload />
    </>
  );
};
