import React, { useRef } from 'react';
import { Upload, Image, Minimize2, CornerRightUp } from 'lucide-react';

interface ControlsProps {
  onFilesChange: (files: FileList | null) => void;
  imageSize: number;
  onImageSizeChange: (value: number) => void; // Expects the handler directly
  gap: number;
  onGapChange: (value: number) => void;
  borderRadius: number;
  onBorderRadiusChange: (value: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  onFilesChange,
  imageSize,
  onImageSizeChange, // Use the passed handler directly
  gap,
  onGapChange,
  borderRadius,
  onBorderRadiusChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilesChange(event.target.files);
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <button
        onClick={handleButtonClick}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        <Upload size={18} className="mr-2" />
        Upload Images
      </button>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {/* Image Size Slider */}
        <div className="flex items-center gap-2">
          <Image size={18} className="text-gray-600" />
          <label htmlFor="imageSize" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Size:
          </label>
          <input
            id="imageSize"
            type="range"
            min="1" // Smallest grid unit width
            max="12" // Max grid unit width (assuming 12 cols max)
            step="1"
            value={imageSize}
            onChange={(e) => onImageSizeChange(Number(e.target.value))} // Call handler directly
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="text-sm text-gray-600 w-6 text-right">{imageSize}</span>
        </div>

        {/* Gap Slider */}
        <div className="flex items-center gap-2">
          <Minimize2 size={18} className="text-gray-600 transform rotate-45" />
          <label htmlFor="gap" className="text-sm font-medium text-gray-700">
            Gap:
          </label>
          <input
            id="gap"
            type="range"
            min="0"
            max="30" // Pixels
            step="1"
            value={gap}
            onChange={(e) => onGapChange(Number(e.target.value))}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="text-sm text-gray-600 w-8 text-right">{gap}px</span>
        </div>

        {/* Border Radius Slider */}
        <div className="flex items-center gap-2">
          <CornerRightUp size={18} className="text-gray-600" />
          <label htmlFor="borderRadius" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Corners:
          </label>
          <input
            id="borderRadius"
            type="range"
            min="0"
            max="40" // Pixels
            step="1"
            value={borderRadius}
            onChange={(e) => onBorderRadiusChange(Number(e.target.value))}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="text-sm text-gray-600 w-8 text-right">{borderRadius}px</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
