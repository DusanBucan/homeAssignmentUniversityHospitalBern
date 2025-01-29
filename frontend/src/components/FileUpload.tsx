import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Paper,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFileUpload } from '../hooks/useFileUpload';

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { loading, error: uploaderError, uploadDICOMFile } = useFileUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/dicom': ['.dcm'], // Accept only DICOM files
    },
    maxFiles: 1, // Allow only 1 file
    maxSize: 5 * 1024 * 1024, // 5MB limit
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const errorMessage = rejectedFiles[0].errors
          .map((err) => {
            if (err.code === 'file-too-large') {
              return t('fileUploadPage.errorTooLarge');
            }
            if (err.code === 'file-invalid-type') {
              return t('fileUploadPage.errorInvalidType');
            }
            return t('fileUploadPage.errorGeneral');
          })
          .join(', ');

        setError(errorMessage);
      } else {
        setError(null);
        setFiles(acceptedFiles);
      }
    },
  });

  const handleClearFiles = () => {
    setFiles([]);
    setError(null);
  };

  const handleConfirmUpload = () => {
    if (files.length === 0 || loading) return;
    uploadDICOMFile(files[0]);
    setFiles([]);
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #1976d2',
          p: 4,
          cursor: 'pointer',
          bgcolor: isDragActive ? '#f0f0f0' : 'transparent',
          borderRadius: 2,
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon color="primary" sx={{ fontSize: 48 }} />
        <Typography variant="h6" mt={1}>
          {isDragActive
            ? t('fileUploadPage.ddTOnlyActiveText')
            : t('fileUploadPage.ddPlusClickText')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t('fileUploadPage.allowedFormats')} .dcm |{' '}
          {t('fileUploadPage.maxSize')} 5MB
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          {t('fileUploadPage.browseFiles')}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {uploaderError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {uploaderError.message}
        </Typography>
      )}

      {files.length > 0 && (
        <Stack sx={{ mt: 2 }} spacing={2}>
          <List>
            {files.map((file) => (
              <ListItem key={file.name}>{file.name}</ListItem>
            ))}
          </List>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={handleClearFiles}
            >
              {t('fileUploadPage.clearFiles')}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleConfirmUpload}
            >
              {t('fileUploadPage.confirmUpload')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}
