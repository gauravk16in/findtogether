import React, { useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../src/services/supabase.frontend.service';
import CloseIcon from '../components/icons/CloseIcon';
import UploadIcon from '../components/icons/UploadIcon';

interface ReportMissingPageProps {
  onClose: () => void;
}

interface FormData {
  // Missing person details
  fullName: string;
  missingSince: string;
  gender: string;
  age: number;
  lastSeen: string;
  appearance: string;
  identification: string;
  socialMedia: string;
  
  // Reporter details
  reporterName: string;
  relation: string;
  whatsapp: string;
  address: string;
  contactNumber: string;
  email: string;
  
  // Photo
  photo: File | null;
}

const FormField: React.FC<{ 
  id: string; 
  label: string; 
  type?: string; 
  placeholder: string; 
  required?: boolean; 
  as?: 'input' | 'textarea';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  as = 'input',
  value,
  onChange,
}) => {
  const commonProps = {
    id,
    name: id,
    className: "mt-2 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-colors",
    placeholder,
    required,
    value,
    onChange,
  };

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {as === 'textarea' ? <textarea {...commonProps} rows={3}></textarea> : <input type={type} {...commonProps} />}
    </div>
  );
};


const ReportMissingPage: React.FC<ReportMissingPageProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    // Missing person details
    fullName: '',
    missingSince: '',
    gender: '',
    age: 0,
    lastSeen: '',
    appearance: '',
    identification: '',
    socialMedia: '',
    
    // Reporter details
    reporterName: '',
    relation: '',
    whatsapp: '',
    address: '',
    contactNumber: '',
    email: user?.email || '',
    
    // Photo
    photo: null,
  });

  const generateCaseId = () => {
    const now = new Date();
    const dateTime = now.toISOString().replace(/[-:.]/g, '').slice(0, 15); // YYYYMMDDTHHMMSS
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FT${dateTime}${randomNum}`;
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `missing-persons/${fileName}`;

      // First, try to ensure the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const photoBucket = buckets?.find(bucket => bucket.id === 'photos');
      
      if (!photoBucket) {
        console.log('Creating photos bucket...');
        const { error: bucketError } = await supabase.storage.createBucket('photos', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 10485760 // 10MB
        });
        if (bucketError && !bucketError.message.includes('already exists')) {
          console.error('Failed to create bucket:', bucketError);
        }
      }

      // Try uploading the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // If it's a RLS policy error, try a different approach
        if (uploadError.message.includes('row-level security policy')) {
          console.log('RLS policy blocking upload. Please run the SQL script in fix-storage-policies.sql');
          throw new Error('Photo upload blocked by security policy. Please contact administrator to configure storage permissions.');
        }
        
        return null;
      }

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Generate case ID
      const newCaseId = generateCaseId();
      
      // Upload photo if provided
      let photoUrl: string | null = null;
      if (formData.photo) {
        try {
          photoUrl = await uploadPhoto(formData.photo);
        } catch (uploadError: any) {
          setError(uploadError.message || 'Failed to upload photo. Please try again.');
          setIsSubmitting(false);
          return;
        }
        
        if (!photoUrl) {
          setError('Failed to upload photo. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Insert person data
      const { data: personData, error: personError } = await supabase
        .from('persons')
        .insert({
          name: formData.fullName,
          age: formData.age,
          description: formData.appearance,
          last_seen_location: formData.lastSeen,
          last_seen_date: formData.missingSince,
        } as any)
        .select()
        .single();

      if (personError) {
        throw personError;
      }

      // Insert photo if available
      if (photoUrl && (personData as any)?.id) {
        await supabase
          .from('photos')
          .insert({
            person_id: (personData as any).id,
            image_url: photoUrl,
          } as any);
      }

      // Insert case data
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          person_id: (personData as any).id,
          status: 'New',
          reported_by: formData.reporterName,
          contact_name: formData.reporterName,
          contact_role: formData.relation,
        } as any)
        .select()
        .single();

      if (caseError) {
        throw caseError;
      }

      // Store additional reporter details in reports table
      await supabase
        .from('reports')
        .insert({
          case_id: (caseData as any).id,
          reporter_name: formData.reporterName,
          reporter_relation: formData.relation,
          reporter_whatsapp: formData.whatsapp,
          reporter_address: formData.address,
          reporter_contact: formData.contactNumber,
          reporter_email: formData.email,
          missing_person_identification: formData.identification,
          missing_person_social_media: formData.socialMedia,
        } as any);

      // Notify volunteers
      try {
          const apiUrl = process.env.NODE_ENV === 'production' 
            ? '/api/cases/notify' 
            : 'http://localhost:4000/api/cases/notify';
            
          await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  caseId: (caseData as any).id,
                  locationDescription: formData.lastSeen,
                  // lat, lng would go here if we had them
              })
          });
      } catch (notifyError) {
          console.error('Failed to notify volunteers:', notifyError);
          // Don't block success message
      }

      setCaseId(newCaseId);
      setSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      setError(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative bg-white w-full max-w-md rounded-3xl p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Strong</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-800 mb-4">
              Thank you for trusting us. Your case ID is <strong className="text-blue-600">{caseId}</strong>.
            </p>
            <p className="text-gray-600 text-sm">
              Your submission is safe and already being processed. We will contact you soon with updates.
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-black text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
        <style>{`
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
     <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-missing-title"
    >
      <div
        className="relative bg-gray-50 text-black w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
         <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 id="report-missing-title" className="text-xl font-bold">Report a Missing Person</h1>
            <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        
        <form className="flex-grow overflow-y-auto" onSubmit={handleSubmit}>
            <div className="p-8 md:p-10">
                <section>
                    <h2 className="text-lg font-semibold text-gray-800">Missing Person's Details</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField 
                          id="fullName" 
                          label="Full Name" 
                          placeholder="e.g., Jane Doe" 
                          required 
                          value={formData.fullName}
                          onChange={handleInputChange('fullName')}
                        />
                        <FormField 
                          id="missingSince" 
                          label="Missing Since" 
                          type="date" 
                          placeholder="" 
                          required 
                          value={formData.missingSince}
                          onChange={handleInputChange('missingSince')}
                        />
                        <FormField 
                          id="gender" 
                          label="Gender" 
                          placeholder="e.g., Female" 
                          required 
                          value={formData.gender}
                          onChange={handleInputChange('gender')}
                        />
                        <FormField 
                          id="age" 
                          label="Age" 
                          type="number" 
                          placeholder="e.g., 28" 
                          required 
                          value={formData.age}
                          onChange={handleInputChange('age')}
                        />
                        <FormField 
                          id="lastSeen" 
                          label="Last Seen Location" 
                          placeholder="e.g., Northwood Park, Central City" 
                          required 
                          value={formData.lastSeen}
                          onChange={handleInputChange('lastSeen')}
                        />
                        <div className="md:col-span-2">
                             <FormField 
                               id="appearance" 
                               label="Detailed Physical Description & Clothing" 
                               as="textarea" 
                               placeholder="Please provide comprehensive details: Height, build, hair color/style, eye color, clothing worn, distinctive features, etc. Example: 5ft 6in tall, medium build, long brown hair in ponytail, brown eyes, wearing blue jeans, red sweater, white sneakers. Has small scar on left cheek." 
                               required 
                               value={formData.appearance}
                               onChange={handleInputChange('appearance')}
                             />
                             <p className="text-xs text-gray-500 mt-1">
                               💡 <strong>Tip:</strong> Detailed descriptions help searchers identify the person more easily. Include height, build, hair, clothing, and any unique features.
                             </p>
                        </div>
                        <FormField 
                          id="identification" 
                          label="Distinctive Features & Marks" 
                          placeholder="e.g., Tattoo of bird on left wrist, birthmark on forehead, pierced ears, glasses, braces, etc." 
                          value={formData.identification}
                          onChange={handleInputChange('identification')}
                        />
                        <FormField 
                          id="socialMedia" 
                          label="Any Social Media Handle" 
                          placeholder="e.g., @janedoe (Optional)" 
                          value={formData.socialMedia}
                          onChange={handleInputChange('socialMedia')}
                        />
                    </div>
                </section>

                <div className="my-8 border-t border-gray-200"></div>

                <section>
                    <h2 className="text-lg font-semibold text-gray-800">Your Information (Reporter)</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField 
                          id="reporterName" 
                          label="Your Name" 
                          placeholder="e.g., John Smith" 
                          required 
                          value={formData.reporterName}
                          onChange={handleInputChange('reporterName')}
                        />
                        <FormField 
                          id="relation" 
                          label="Relation with Missing Person" 
                          placeholder="e.g., Family, Friend" 
                          required 
                          value={formData.relation}
                          onChange={handleInputChange('relation')}
                        />
                        <FormField 
                          id="whatsapp" 
                          label="WhatsApp Number" 
                          placeholder="+1 (123) 456-7890" 
                          required 
                          value={formData.whatsapp}
                          onChange={handleInputChange('whatsapp')}
                        />
                        <FormField 
                          id="address" 
                          label="Address" 
                          placeholder="Your current address" 
                          required 
                          value={formData.address}
                          onChange={handleInputChange('address')}
                        />
                        <FormField 
                          id="contactNumber" 
                          label="Contact Number" 
                          type="tel" 
                          placeholder="(123) 456-7890" 
                          required 
                          value={formData.contactNumber}
                          onChange={handleInputChange('contactNumber')}
                        />
                        <FormField 
                          id="email" 
                          label="Email Address" 
                          type="email" 
                          placeholder="you@example.com" 
                          required 
                          value={formData.email}
                          onChange={handleInputChange('email')}
                        />
                    </div>
                </section>
                
                <div className="my-8 border-t border-gray-200"></div>

                <section>
                    <h2 className="text-lg font-semibold text-gray-800">Upload Photo</h2>
                     <div className="mt-4 flex justify-center items-center w-full">
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadIcon className="w-8 h-8 mb-4 text-gray-500" />
                                {formData.photo ? (
                                  <div className="text-center">
                                    <p className="mb-2 text-sm text-green-600 font-semibold">
                                      ✓ {formData.photo.name}
                                    </p>
                                    <p className="text-xs text-gray-500">Click to change photo</p>
                                  </div>
                                ) : (
                                  <>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, or JPEG (MAX. 10MB)</p>
                                  </>
                                )}
                            </div>
                            <input 
                              id="file-upload" 
                              name="photo" 
                              type="file" 
                              className="hidden" 
                              accept="image/png, image/jpeg, image/jpg" 
                              onChange={handleFileChange}
                            />
                        </label>
                    </div> 
                </section>
            </div>

            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </div>
        </form>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ReportMissingPage;
