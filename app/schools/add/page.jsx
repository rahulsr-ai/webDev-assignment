'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  FaBuilding, 
  FaCamera,
  FaSave,
  FaSpinner,
  FaUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCloud
} from 'react-icons/fa';

const schoolSchema = yup.object({
  name: yup.string().required('School name is required').min(2),
  address: yup.string().required('Address is required').min(10),
  city: yup.string().required('City is required').min(2),
  state: yup.string().required('State is required').min(2),
  contact: yup.string().required('Contact is required').matches(/^[0-9]{10}$/),
  email_id: yup.string().required('Email is required').email(),
});

export default function AddSchoolPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schoolSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    if (!imageUrl) {
      setSubmitStatus({ type: 'error', message: 'Please upload an image' });
      return;
    }

    try {
      setIsLoading(true);
      setSubmitStatus({ type: '', message: '' });

      const response = await fetch('/api/schools/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          contact: data.contact,
          email_id: data.email_id,
          image: imageUrl
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setSubmitStatus({ type: 'success', message: 'School registered successfully!' });
      reset();
      setImageUrl('');

      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          
          {/* Header */}
        

          {/* Status Message */}
          {submitStatus.message && (
            <div className={`backdrop-blur-sm border rounded-xl p-4 mb-6 shadow-lg ${
              submitStatus.type === 'success' 
                ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' 
                : 'bg-red-50/70 text-red-800 border-red-200/50'
            }`}>
              <div className="flex items-center space-x-3">
                {submitStatus.type === 'success' ? (
                  <FaCheckCircle className="text-emerald-600 text-lg" />
                ) : (
                  <FaExclamationTriangle className="text-red-600 text-lg" />
                )}
                <div className="font-medium">{submitStatus.message}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="backdrop-blur-sm bg-white/70 border border-gray-200/50 rounded-xl shadow-xl p-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Form Fields */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* School Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        School Name
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all duration-200 text-slate-800 ${
                          errors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                        }`}
                        placeholder="Enter School name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                      <input
                        type="text"
                        {...register('city')}
                        className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all duration-200 text-slate-800 ${
                          errors.city ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                      <input
                        type="text"
                        {...register('state')}
                        className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all duration-200 text-slate-800 ${
                          errors.state ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                        }`}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Contact</label>
                      <input
                        type="tel"
                        {...register('contact')}
                        className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all duration-200 text-slate-800 ${
                          errors.contact ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                        }`}
                        placeholder="10-digit number"
                      />
                      {errors.contact && (
                        <p className="text-red-600 text-sm mt-1">{errors.contact.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        {...register('email_id')}
                        className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all duration-200 text-slate-800 ${
                          errors.email_id ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                        }`}
                        placeholder="email@School.edu"
                      />
                      {errors.email_id && (
                        <p className="text-red-600 text-sm mt-1">{errors.email_id.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                    <textarea
                      {...register('address')}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg backdrop-blur-sm bg-white/50 focus:bg-white/70 focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all duration-200 resize-none text-slate-800 ${
                        errors.address ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                      }`}
                      placeholder="Complete address"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                {/* Cloudinary Upload Widget */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
                      <FaCamera className="mr-2 text-slate-600" />
                      School Photo
                    </h3>
                   
                  </div>
                  
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{
                      folder: 'schools',
                      maxFiles: 1,
                      resourceType: 'image',
                      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                      maxFileSize: 5000000 // 5MB
                    }}
                    onSuccess={(result) => {
                      console.log('Upload Success:', result.info);
                      setImageUrl(result.info.secure_url);
                      setSubmitStatus({ type: 'success', message: 'Image uploaded successfully!' });
                    }}
                    onError={(error) => {
                      console.error('Upload Error:', error);
                      setSubmitStatus({ type: 'error', message: 'Failed to upload image. Please try again.' });
                    }}
                  >
                    {({ open }) => (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-gray-50/30 hover:bg-gray-100/50"
                        >
                          <FaCloud className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <FaUpload className="h-6 w-6 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm font-medium text-slate-700 mb-1">
                            Click to Upload
                          </p>
                          <p className="text-xs text-slate-500">
                            JPG, PNG, WebP (max 5MB)
                          </p>
                        </button>
                        
                        {imageUrl && (
                          <div className="relative">
                            <img
                              src={imageUrl}
                              alt="Uploaded"
                              className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                            <div className="absolute top-2 right-2">
                              <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-slate-600 flex items-center">
                                <FaCheckCircle className="mr-1 text-green-600" />
                                Uploaded
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading || !imageUrl}
                  className={`inline-flex items-center px-8 py-3 border border-transparent rounded-lg font-medium transition-all duration-200 ${
                    isLoading || !imageUrl
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Register School
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
