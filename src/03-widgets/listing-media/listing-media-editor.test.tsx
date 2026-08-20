import { render, screen } from '@testing-library/react';
import { ListingMediaEditor } from './listing-media-editor';

const noop = () => undefined;

describe('ListingMediaEditor', () => {
  it('should mark the first photo as cover and the video as the last slide', () => {
    render(
      <ListingMediaEditor
        photoAssetIds={['photo-1', 'photo-2']}
        photoPreviews={{ 'photo-1': 'https://cdn.example/1.jpg', 'photo-2': 'https://cdn.example/2.jpg' }}
        videoAssetId="video-1"
        videoPreview="https://cdn.example/clip.mp4"
        onAddPhotos={noop}
        onRemovePhoto={noop}
        onMovePhoto={noop}
        onReorderPhotos={noop}
        onSetVideo={noop}
        onClearVideo={noop}
      />,
    );

    expect(screen.getByText('Capa')).toBeInTheDocument();
    expect(screen.getByText('Último')).toBeInTheDocument();
    expect(screen.getByText(/falta 1 foto para o mínimo de 3/i)).toBeInTheDocument();
    expect(screen.getByText('Como fotografar e gravar a unidade')).toBeInTheDocument();
    expect(screen.getByText('Roteiro da unidade real')).toBeInTheDocument();
    expect(screen.getByLabelText('Requisitos rápidos')).toBeInTheDocument();
  });

  it('should stop asking for more photos once the minimum is met', () => {
    render(
      <ListingMediaEditor
        photoAssetIds={['photo-1', 'photo-2', 'photo-3']}
        photoPreviews={{
          'photo-1': 'https://cdn.example/1.jpg',
          'photo-2': 'https://cdn.example/2.jpg',
          'photo-3': 'https://cdn.example/3.jpg',
        }}
        videoAssetId={null}
        videoPreview={null}
        onAddPhotos={noop}
        onRemovePhoto={noop}
        onMovePhoto={noop}
        onReorderPhotos={noop}
        onSetVideo={noop}
        onClearVideo={noop}
      />,
    );

    expect(screen.getByText(/3 fotos na ordem do carrossel/i)).toBeInTheDocument();
    expect(screen.getByText(/ainda falta um vídeo mp4/i)).toBeInTheDocument();
  });
});
