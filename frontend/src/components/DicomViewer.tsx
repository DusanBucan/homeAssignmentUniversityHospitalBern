import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  init as dicomImageLoaderInit,
  wadouri,
} from '@cornerstonejs/dicom-image-loader';
import {
  init as csRenderInit,
  Enums,
  RenderingEngine,
  metaData,
} from '@cornerstonejs/core';
import { convertMultiframeImageIds } from '../utils/cornerstone.utils';
import { useDicomViewer } from '../hooks/useDicomViewer';
import Skeleton from '@mui/material/Skeleton';

interface DicomViewerProps {
  fileId?: string;
}

export const DicomViewer = ({ fileId }: DicomViewerProps) => {
  const { t } = useTranslation();

  const viewportId = 'CT';
  let renderingEngine: RenderingEngine;
  const renderingEngineId = 'myRenderingEngine';

  const stackViewportRef = useRef<ReturnType<
    typeof renderingEngine.getStackViewport
  > | null>(null) as MutableRefObject<any>;
  const elementRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);
  const { getDICOMImageByFileId, error, loading } = useDicomViewer();
  const [dicomBlob, setDicomBlob] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    const setup = async () => {
      if (running.current) return;

      running.current = true;
      csRenderInit();
      dicomImageLoaderInit({ maxWebWorkers: 1 });

      renderingEngine = new RenderingEngine(renderingEngineId);
      const viewportInput = {
        viewportId,
        type: Enums.ViewportType.STACK,
        element: elementRef.current,
      };
      renderingEngine.enableElement(viewportInput as any);
      stackViewportRef.current = renderingEngine.getStackViewport(viewportId);

      if (fileId) {
        const fetchedDicomBlob = await getDICOMImageByFileId(fileId);
        setDicomBlob(fetchedDicomBlob);
      }
    };
    setup();
  }, [fileId]);

  useEffect(() => {
    const display = async (dicomBlob: Blob | undefined) => {
      if (!dicomBlob || !stackViewportRef.current) return;

      const cornerstoneImageId = wadouri.fileManager.add(dicomBlob);
      await wadouri.loadImage(cornerstoneImageId).promise;

      const stack = convertMultiframeImageIds(metaData, [cornerstoneImageId]);
      await stackViewportRef.current.setStack(stack);
      stackViewportRef.current.render();
    };
    display(dicomBlob);
  }, [dicomBlob]);

  useEffect(() => {
    if (error && elementRef.current) {
      elementRef.current.innerHTML = `${t('filePreviewPage.notFoundDicomFile')}`;
    }
  }, [error]);

  return (
    <div style={{ position: 'relative', width: '512px', height: '512px' }}>
      {loading && (
        <Skeleton
          variant="rectangular"
          width={512}
          height={512}
          sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
        />
      )}
      <div
        ref={elementRef}
        style={{
          width: '512px',
          height: '512px',
          backgroundColor: '#fff',
          opacity: loading ? 0 : 1, // Ensure Cornerstone gets the element but keep it hidden while loading
          transition: 'opacity 0.3s ease-in-out',
        }}
      ></div>
    </div>
  );
};
