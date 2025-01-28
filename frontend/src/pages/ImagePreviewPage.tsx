import { useEffect } from 'react';
import { useParams } from 'react-router';
import { restInstance } from '../clients/backendApiClient';
import { Typography } from '@mui/material';
import { DicomParser, createImage, createView } from 'dwv';

export const ImagePreviewPage = () => {
  const { imageId } = useParams<{ imageId: string }>();

  useEffect(() => {
    restInstance
      .get(`/files/${imageId}`, {
        responseType: 'arraybuffer',
      })
      .then((response) => {
        debugger
        const dicomParser = new DicomParser();
        dicomParser.parse(response.data);

        const image = createImage(dicomParser.getDicomElements());
        const view = createView(dicomParser.getDicomElements(), image);

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        const imageData = ctx!.createImageData(800, 800);
        view.generateImageData(imageData, view.getCurrentIndex()); // todo not sure if this is okay
        ctx!.putImageData(imageData, 0, 0);
        const div = document.getElementById('dwv');
        div!.appendChild(canvas);
      })
      .catch((error) => {
        console.error('There was an error fetching the data:', error);
      });
  }, [imageId]);


  useEffect(()=> {

    const div = document.getElementById('dwv');
    while (div!.firstChild) {
      div!.removeChild(div!.firstChild);
    }
  }, [imageId])

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        DICOM Viewer
      </Typography>
      <div
        id="dwv"
        style={{ width: '800px', height: '600px', marginTop: '20px' }}
      ></div>
    </div>
  );
};
