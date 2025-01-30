import { useCallback, useState } from 'react';
import {
  backendApiInstanceGQL,
  backendApiInstanceREST,
} from '../clients/backendApiClient';

interface FileListingTableRowData {
  id: string;
  fileName: string;
  patientName: string;
  patientBirthDate: string;
  seriesDescription: string;
}

export interface UseFilterListingOutput {
  page: number;
  pageSize: number;
  count: number;
  files: FileListingTableRowData[];
}

interface UseFilterListingServerDataResponse {
  id: string;
  filePath: string;
  patient: {
    name: string;
    birthDate: string;
  };
  series: {
    description: string;
  };
}

const query = `
    query GetAll($pageSize: Int, $page: Int) {
        getAll(pageSize: $pageSize, page: $page) {
            page
            pageSize
            count
            files {
              id
              filePath
              patient {
                name
                birthDate
              }
              series {
                description
              }
            }
          }
      }
`;

const getFileName = (filePath: string): string => {
  const parts = filePath.split(/[\\/]/);
  return parts[parts.length - 1];
};

const dataMapper = (
  rawData: UseFilterListingServerDataResponse[]
): FileListingTableRowData[] => {
  return rawData.map((rawItem) => ({
    id: rawItem.id,
    fileName: getFileName(rawItem.filePath),
    patientName: rawItem.patient.name,
    patientBirthDate: rawItem.patient.birthDate,
    seriesDescription: rawItem.series.description,
  }));
};

export const useFileListing = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const getData = useCallback(
    async (page: number, pageSize: number): Promise<UseFilterListingOutput> => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await backendApiInstanceGQL.post('', {
          query,
          variables: { pageSize, page },
        });
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const result = data.data.getAll;
        return {
          page: result.page,
          pageSize: result.pageSize,
          count: result.count,
          files: dataMapper(result.files ?? []),
        };
      } catch (e: any) {
        setError(e);
        return { page, pageSize, count: 0, files: [] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const downloadDICOMFile = useCallback(
    async (fileId: string, fileName: string) => {
      setLoading(true);
      setError(null);

      try {
        const rawDicomResponse = await backendApiInstanceREST.get(
          `/files/${fileId}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const dicomBlob = new Blob([rawDicomResponse.data], {
          type: 'application/dicom',
        });
        const blobUrl = URL.createObjectURL(dicomBlob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName ?? `${fileId}.dcm`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getData,
    downloadDICOMFile,
  };
};
