import { useState } from 'react';
import { backendApiInstanceGQL } from '../clients/backendApiClient';
import { useTranslation } from 'react-i18next';
import { enqueueSnackbar } from 'notistack';

export const useFileUpload = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  const uploadDICOMFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append(
        'operations',
        `{"query": "mutation UploadFile($file: Upload!) {uploadFile(file: $file) {id, filePath}}", "variables": {"file": null}, "operationName": "UploadFile"}`
      );
      formData.append('map', `{"0": ["variables.file"]}`);
      formData.append('0', file);
      setLoading(true);

      await backendApiInstanceGQL.postForm('', formData, {
        headers: {
          'apollo-require-preflight': 'false',
        },
      });
      setLoading(false);
      enqueueSnackbar(t('fileUploadPage.uploadSuccess'), {
        variant: 'success',
      });
    } catch (e: any) {
      setError(e);
      enqueueSnackbar(t('fileUploadPage.uploadFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    uploadDICOMFile,
  };
};
