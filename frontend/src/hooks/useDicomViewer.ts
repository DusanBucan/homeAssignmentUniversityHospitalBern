import { useEffect, useState } from 'react';
import { restInstance } from '../clients/backendApiClient';

export const useDicomViewer = (fileId: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dicomBlob, setDicomBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const getDICOMImageByFileId = async (fileId: string) => {
    try {
      setLoading(true);
      const rawDicomResponse = await restInstance.get(`/files/${fileId}`, {
        responseType: 'arraybuffer',
      });

      const newBlob = new Blob([rawDicomResponse.data], {
        type: 'application/dicom',
      });

      setDicomBlob(newBlob);
      setLoading(false);
    } catch (e: any) {
      setError(e);
      setDicomBlob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) {
      getDICOMImageByFileId(fileId);
    }
  }, [fileId]);

  return { dicomBlob, loading, error, getDICOMImageByFileId };
};
