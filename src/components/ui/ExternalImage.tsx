'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ExternalImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

// This component handles external images with proper error handling
export default function ExternalImage({
  src,
  alt,
  fallbackSrc = 'https://via.placeholder.com/600x400?text=Image+Not+Available',
  ...props
}: ExternalImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (!isError) {
          setImgSrc(fallbackSrc);
          setIsError(true);
        }
      }}
      unoptimized // Needed for external images
    />
  );
}
