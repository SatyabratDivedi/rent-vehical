'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface FormData {
  title: string;
  description: string;
  isOwner: boolean;
  images: File[];
}

interface ImagePreview {
  file: File;
  url: string;
}

export default function VehiclePage() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    isOwner: false,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (imagePreviews.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    const newPreviews: ImagePreview[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setError('');
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('isOwner', formData.isOwner.toString());
      formData.images.forEach((image) => {
        submitFormData.append('images', image);
      });
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/create-vehicle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload vehicle');
      }

      setIsSuccess(true);

      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg className='w-8 h-8 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Vehicle Uploaded Successfully!</h2>
          <p className='text-gray-600 dark:text-gray-300 mb-6'>Your vehicle has been added to the platform. You can check it in your vehicle lists.</p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                title: '',
                description: '',
                isOwner: false,
                images: [],
              });
              setImagePreviews([]);
            }}
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200'
          >
            Add Another Vehicle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-6'>
            <h1 className='text-3xl font-bold text-white'>Add Your Vehicle</h1>
            <p className='text-blue-100 mt-2'>Share your vehicle with our community</p>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
              </div>
            )}

            {/* Title Field */}
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Vehicle Title *
              </label>
              <input type='text' id='title' name='title' value={formData.title} onChange={handleInputChange} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200' placeholder='e.g., Toyota Camry 2020' required />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Description *
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200'
                placeholder='Describe your vehicle, its condition, features, etc.'
                required
              />
            </div>

            {/* Owner Checkbox */}
            <div className='flex items-center space-x-3'>
              <input type='checkbox' id='isOwner' name='isOwner' checked={formData.isOwner} onChange={handleInputChange} className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
              <label htmlFor='isOwner' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Are you the owner of this vehicle?
              </label>
            </div>

            {/* Image Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Vehicle Images (Max 5)</label>

              {imagePreviews.length < 5 && (
                <div className='mb-4'>
                  <label htmlFor='images' className='cursor-pointer'>
                    <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200'>
                      <svg className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                        <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                      <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                        <span className='font-medium text-blue-600 dark:text-blue-400'>Click to upload</span> or drag and drop
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-500'>PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </label>
                  <input type='file' id='images' multiple accept='image/*' onChange={handleImageUpload} className='hidden' />
                </div>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className='relative group'>
                      <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700'>
                        <Image src={preview.url} alt={`Preview ${index + 1}`} width={200} height={200} className='h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200' />
                      </div>
                      <button type='button' onClick={() => removeImage(index)} className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <button type='submit' disabled={isSubmitting} className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center'>
                {isSubmitting ? (
                  <>
                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Submit Vehicle'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
