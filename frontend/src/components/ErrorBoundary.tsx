import React, { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { isRouteErrorResponse } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, t } = this.props;

    if (hasError) {
      if (isRouteErrorResponse(error)) {
        return (
          <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" color="error" gutterBottom>
              {error.status} {error.statusText}
            </Typography>
            <Typography variant="body1">
              {error.data || errorInfo || t('error.unexpected')}
            </Typography>
          </Paper>
        );
      } else if (error instanceof Error) {
        return (
          <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" color="error" gutterBottom>
              {t('error.title')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {error.message}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('error.stackTrace')}
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: '#f4f4f4',
                padding: 2,
                borderRadius: 1,
                overflowX: 'auto',
                textAlign: 'left',
              }}
            >
              {error.stack}
            </Box>
          </Paper>
        );
      } else {
        return (
          <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" color="error" gutterBottom>
              {t('error.unknown')}
            </Typography>
          </Paper>
        );
      }
    }

    return <>{children}</>;
  }
}

export default withTranslation()(ErrorBoundary);
