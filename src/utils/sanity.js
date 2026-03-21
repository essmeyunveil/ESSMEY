// src/utils/sanity.js

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // Enable CDN for better performance
  apiVersion: '2023-05-03',
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
  ignoreBrowserTokenWarning: true,
  perspective: 'published',
  stega: {
    enabled: false
  },
  image: {
    // Default image configuration
    sizes: {
      '1x': '600px',
      '2x': '1200px',
    },
    // Default quality settings
    quality: 80,
  },
  onError: (error) => {
    console.error('Sanity client error:', error);
    if (process.env.NODE_ENV === 'production') {
      // Add error tracking service here
      // Example: Sentry.captureException(error);
    }
  }
});

export const client = sanityClient;
export { sanityClient };

const builder = imageUrlBuilder(client)

export const urlFor = (source, options = {}) => {
  // Handle null or undefined source
  if (!source || !source.asset) {
    console.warn('Invalid image source:', source);
    return null;
  }
  
  try {
    const image = builder.image(source);
    
    // Apply default optimizations
    image
      .width(options.width || 600)
      .height(options.height || 400)
      .fit('crop')
      .quality(80);
    
    // Add custom transformations if provided
    if (options.transformations) {
      Object.entries(options.transformations).forEach(([key, value]) => {
        if (typeof value === 'function') {
          image[key](value);
        } else {
          image[key](value);
        }
      });
    }
    
    return image.url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    if (process.env.NODE_ENV === 'production') {
      // Add error tracking service here
      // Example: Sentry.captureException(error);
    }
    return null;
  }
}

export function getImageUrl(source) {
  try {
    if (!source || !source.asset) {
      console.warn('Invalid image source:', source);
      return null;
    }
    return builder.image(source).url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return null;
  }
}

// console.log("SanityClient Config: ", { projectId, dataset, apiVersion });
