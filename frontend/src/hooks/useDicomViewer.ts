import { useCallback, useState } from 'react';
import { backendApiInstanceREST } from '../clients/backendApiClient';
import { useTranslation } from 'react-i18next';
import { enqueueSnackbar } from 'notistack';

export const useDicomViewer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  const getDICOMImageByFileId = useCallback(
    async (fileId: string) => {
      try {
        setLoading(true);
        const rawDicomResponse = await backendApiInstanceREST.get(
          `/files/${fileId}`,
          {
            responseType: 'arraybuffer',
          }
        );

        const newBlob = new Blob([rawDicomResponse.data], {
          type: 'application/dicom',
        });

        return newBlob;
      } catch (e: any) {
        setError(e);
        enqueueSnackbar(t('filePreviewPage.notFoundDicomFile'), {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  return { loading, error, getDICOMImageByFileId };
};
