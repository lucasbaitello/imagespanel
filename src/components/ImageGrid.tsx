import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { ImageItem, LayoutItem } from '../App'; // Import interfaces
import { X } from 'lucide-react';

// Import react-grid-layout css
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ImageGridProps {
  images: ImageItem[];
  layout: LayoutItem[]; // Expect layout to be fully managed by App.tsx
  onLayoutChange: (layout: Layout[]) => void;
  gap: number;
  borderRadius: number;
  onRemoveImage: (id: string) => void;
  rowHeight: number; // Receive rowHeight from App
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  layout, // Use the layout directly from props
  onLayoutChange,
  gap,
  borderRadius,
  onRemoveImage,
  rowHeight, // Use the fixed rowHeight from App
}) => {
  // No need to generate layout here; App.tsx is the source of truth.
  const currentLayout = layout;

  if (!images || images.length === 0) {
    return null; // Don't render RGL if no images
  }

  // Filter layout to only include items corresponding to existing images
  const validLayout = currentLayout.filter(l => images.some(img => img.id === l.i));


  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: validLayout }} // Use the filtered layout from App state
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} // Ensure enough columns are available
      rowHeight={rowHeight} // Use fixed rowHeight passed from App
      margin={[gap, gap]} // Use gap for margin
      containerPadding={[gap, gap]} // Use gap for container padding
      onLayoutChange={(newLayout, allLayouts) => {
        // Ensure we only pass the layout for the current breakpoint (lg in this case)
        // RGL's onLayoutChange provides the layout for the *current* breakpoint
        onLayoutChange(newLayout);
      }}
      draggableHandle=".drag-handle" // Optional: specify a handle for dragging
      isResizable={true}
      isDraggable={true}
      compactType="vertical" // Key for masonry-like packing
      preventCollision={true} // Prevent items from overlapping
      // useCSSTransforms={true} // Generally recommended for performance
    >
      {images.map((image) => {
        // Find the layout item for the current image
        const itemLayout = validLayout.find(l => l.i === image.id);
        // If layout is somehow missing after filtering, skip rendering this item
        if (!itemLayout) {
          console.warn(`Layout item not found for image ${image.id}`);
          return null;
        }

        return (
          <div
            key={image.id}
            // data-grid is managed internally by RGL based on the layout prop
            className="group bg-gray-200 overflow-hidden relative shadow-md hover:shadow-lg transition-shadow duration-200"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            <img
              src={image.src}
              alt={`Uploaded ${image.id}`}
              className="block w-full h-full object-cover" // Keep object-cover
              style={{ borderRadius: `${borderRadius}px` }}
              onError={(e) => console.error(`Error loading image ${image.id}:`, e)}
              loading="lazy"
            />
            {/* Optional Drag Handle */}
            <div className="drag-handle absolute top-1 left-1 cursor-move p-0.5 bg-black bg-opacity-30 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
               {/* Icon placeholder */}
            </div>
             {/* Remove Button */}
             <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage(image.id);
              }}
              className="absolute top-1 right-1 cursor-pointer p-0.5 bg-red-600 hover:bg-red-700 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center justify-center"
              style={{ width: '20px', height: '20px' }}
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};

export default ImageGrid;
