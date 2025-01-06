import { useState } from 'react';
import { toast } from 'react-toastify';

interface UseImageUploadReturn {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  imageState: {
    idImage: string | null;
    idImageUrl: string;
  };
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [imageState, setImageState] = useState({
    idImage: null as string | null,
    idImageUrl: '',
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB. Please choose a smaller file.");
      return;
    }

    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const cleanBase64 = base64String.split(',')[1];
      setImageState({ 
        idImage: cleanBase64,
        idImageUrl: base64String
      });
    } catch (err) {
      toast.error('Error processing image. Please try again.');
    }
  };

  return { handleImageChange, imageState };
}; 