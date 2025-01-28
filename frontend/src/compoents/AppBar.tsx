import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes, Route } from 'react-router';
import { FileListingPage } from '../pages/FileListingPage';
import { ImagePreviewPage } from '../pages/ImagePreviewPage';
import { FileUploadPage } from '../pages/FileUploadPage';

const LeftSideAppBar: React.FC = () => {
  //   const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left-Side AppBar */}
      <AppBar
        position="static"
        sx={{
          width: '240px', // Set width of AppBar
          height: '100vh', // Full height
          left: 0,
          right: 'auto', // Ensure it's docked to the left
        }}
      >
        <Toolbar
          sx={{
            flexDirection: 'column', // Stack items vertically
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center', // Center items in the AppBar
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mb: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Left AppBar
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Routes>
          <Route path="/" element={<FileListingPage />} />
          <Route path="/file-upload" element={<FileUploadPage />} />
          <Route path="/image-view/:imageId" element={<ImagePreviewPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default LeftSideAppBar;
