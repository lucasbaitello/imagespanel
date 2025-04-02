import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from 'react-grid-layout';
import Controls from './components/Controls';
import ImageGrid from './components/ImageGrid';
import { UploadCloud } from 'lucide-react';

export interface ImageItem {
  id: string;
  src: string;
}

// Ensure LayoutItem includes all necessary properties from RGL's Layout
export interface LayoutItem extends Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  // Add other potential properties if needed, like isDraggable, isResizable etc.
}

function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [imageSize, setImageSize] = useState<number>(4); // Controls width 'w' for EXISTING items via slider
  const [gap, setGap] = useState<number>(10); // Corresponds to margin in RGL
  const [borderRadius, setBorderRadius] = useState<number>(8); // In pixels
  const [rowHeight, setRowHeight] = useState<number>(100); // Base row height for RGL - Keep fixed for now

  // Effect to update layout widths when imageSize slider changes
  useEffect(() => {
    setLayout(prevLayout =>
      prevLayout.map(item => ({
        ...item,
        w: imageSize,
        // Keep height fixed when changing width via slider, RGL might adjust based on content/rowHeight
        // h: item.h // or calculate dynamically if needed
      }))
    );
    // Removed dynamic rowHeight adjustment based on imageSize slider to simplify layout
    // setRowHeight(100 + (imageSize - 1) * 10);

  }, [imageSize]); // Re-run only when imageSize slider changes

  const handleFilesChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const filesArray = Array.from(selectedFiles);
    const newImages: ImageItem[] = [];
    const newLayoutItems: LayoutItem[] = [];
    const existingImageCount = images.length;

    filesArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const id = `img-${existingImageCount + index}-${Date.now()}`;
        const src = e.target?.result as string;
        if (!src) {
          console.error("FileReader error: No result");
          return; // Skip if reading failed
        }
        newImages.push({ id, src });

        // Set initial size smaller (w: 2, h: 2)
        const newLayoutItem: LayoutItem = {
          i: id,
          x: 0, // Let RGL place horizontally based on compaction
          y: Infinity, // Place new items at the bottom
          w: 2, // Initial width set to 2
          h: 2, // Initial height set to 2
        };
        newLayoutItems.push(newLayoutItem);

        // Update state once all files in the batch are processed
        if (newImages.length === filesArray.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
          setLayout((prevLayout) => [...prevLayout, ...newLayoutItems]);
          console.log(`Added ${newImages.length} images with initial size w:2, h:2.`);
        }
      };
      reader.onerror = (e) => {
        console.error("FileReader error:", e);
      };
      reader.readAsDataURL(file);
    });
  };

  // Use useCallback to prevent unnecessary re-renders of ImageGrid
  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    const updatedLayout: LayoutItem[] = newLayout.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      ...(item.isDraggable !== undefined && { isDraggable: item.isDraggable }),
      ...(item.isResizable !== undefined && { isResizable: item.isResizable }),
    }));
    setLayout(updatedLayout);
  }, []);

  const handleRemoveImage = (idToRemove: string) => {
    console.log('Removing image:', idToRemove);
    setImages(prevImages => prevImages.filter(img => img.id !== idToRemove));
    setLayout(prevLayout => prevLayout.filter(item => item.i !== idToRemove));
  };

  // Handler specifically for image size slider changes
  const handleImageSizeChange = (newSize: number) => {
    setImageSize(newSize); // This triggers the useEffect hook
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <Controls
          onFilesChange={handleFilesChange}
          imageSize={imageSize}
          onImageSizeChange={handleImageSizeChange}
          gap={gap}
          onGapChange={setGap}
          borderRadius={borderRadius}
          onBorderRadiusChange={setBorderRadius}
        />
      </header>
      <main className="flex-grow p-4">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UploadCloud size={64} className="mb-4" />
            <p className="text-xl">Upload images to start</p>
            <p>Use the controls above to select files from your computer.</p>
          </div>
        ) : (
          <ImageGrid
            images={images}
            layout={layout}
            onLayoutChange={handleLayoutChange}
            gap={gap}
            borderRadius={borderRadius}
            onRemoveImage={handleRemoveImage}
            rowHeight={rowHeight} // Pass fixed rowHeight
          />
        )}
      </main>
    </div>
  );
}

export default App;
