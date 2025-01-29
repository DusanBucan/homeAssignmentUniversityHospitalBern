import { useParams } from 'react-router';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DicomViewer } from '../components/DicomViewer';

export const FilePreviewPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {t('filePreviewPage.title')}
      </Typography>
      <DicomViewer fileId={fileId} />
    </div>
  );
};
