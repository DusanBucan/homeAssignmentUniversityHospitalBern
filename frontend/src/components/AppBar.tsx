import React from 'react';
import { useNavigate, Navigate } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Routes, Route } from 'react-router';
import { FileListingPage } from '../pages/FileListingPage';
import { FilePreviewPage } from '../pages/FilePreviewPage';
import { FileUploadPage } from '../pages/FileUploadPage';
import { useTranslation } from 'react-i18next';

const LeftSideAppBar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          width: '240px',
          height: '100vh',
          left: 0,
          right: 'auto',
          backgroundColor: 'primary.dark',
        }}
      >
        <Toolbar
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100%',
            paddingTop: 2,
            gap: 2,
          }}
        >
          <Typography variant="h6" component="div" sx={{ color: 'white' }}>
            {t('appBar.title')}
          </Typography>

          <Button
            variant="contained"
            sx={{
              width: '80%',
              backgroundColor: '#ffffff',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => navigate('/')}
          >
            {t('appBar.toolbar.fileList')}
          </Button>

          <Button
            variant="contained"
            sx={{
              width: '80%',
              backgroundColor: '#f5f5f5',
              color: 'secondary.main',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => navigate('/file-upload')}
          >
            {t('appBar.toolbar.fileUpload')}
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Routes>
          <Route path="/" element={<FileListingPage />} />
          <Route path="/file-upload" element={<FileUploadPage />} />
          <Route path="/file-preview/:fileId" element={<FilePreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default LeftSideAppBar;
