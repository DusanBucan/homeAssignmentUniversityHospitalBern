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
  const { getDICOMImageByFileId, error } = useDicomViewer();
  const [dicomBlob, setDicomBlob] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return;
      }
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
        const fetchedDicomblob = await getDICOMImageByFileId(fileId);
        setDicomBlob(fetchedDicomblob);
      }
    };
    setup();
  }, [elementRef, running]);

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
  }, [dicomBlob, stackViewportRef]);

  useEffect(() => {
    if (error && elementRef.current) {
      elementRef.current.innerHTML = `${t('filePreviewPage.notFoundDicomFile')}`;
    }
  }, [error]);

  return (
    <div
      ref={elementRef}
      style={{
        width: '512px',
        height: '512px',
        backgroundColor: '#fff',
      }}
    ></div>
  );
};
