import { useEffect, useRef } from 'react';
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
  const elementRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);
  const { dicomBlob, error } = useDicomViewer(fileId);
  const { t } = useTranslation();

  useEffect(() => {
    const setup = async (dicomBlob: Blob) => {
      if (running.current) {
        return;
      }
      running.current = true;
      csRenderInit();
      dicomImageLoaderInit({ maxWebWorkers: 1 });

      const renderingEngineId = 'myRenderingEngine';
      const renderingEngine = new RenderingEngine(renderingEngineId);
      const viewportId = 'CT';

      const viewportInput = {
        viewportId,
        type: Enums.ViewportType.STACK,
        element: elementRef.current,
      };

      renderingEngine.enableElement(viewportInput as any);
      const viewport = renderingEngine.getStackViewport(viewportId);

      const cornerstoneImageId = wadouri.fileManager.add(dicomBlob);
      await wadouri.loadImage(cornerstoneImageId).promise;

      const stack = convertMultiframeImageIds(metaData, [cornerstoneImageId]);
      await viewport.setStack(stack);

      viewport.render();
    };
    if (dicomBlob) {
      setup(dicomBlob);
    }
  }, [elementRef, running, dicomBlob]);

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
