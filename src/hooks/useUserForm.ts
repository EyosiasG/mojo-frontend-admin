import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/api/users';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idImage: string | null;
  idImageUrl: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export const useUserForm = (userId: string) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idImage: null,
    idImageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = (data: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!data.firstName.trim()) errors.firstName = "First name is required";
    if (!data.lastName.trim()) errors.lastName = "Last name is required";
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(data.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      Swal.fire({
        title: 'Validation Error',
        html: Object.values(validationErrors).join('<br>'),
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        ...(formData.idImage && { id_image: formData.idImage })
      };

      await usersApi.updateUser(userId, updatedData);
      
      await Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      router.push("/agent-dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    setFormData,
    isLoading,
    error,
    validationErrors,
    handleSubmit,
    handleChange
  };
}; 