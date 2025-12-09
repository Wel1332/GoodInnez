import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ChevronLeft, Check, Plus, Minus, UploadCloud } from 'lucide-react'; // Added UploadCloud

export default function AddProperty({ user }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.userType !== 'employee') navigate('/');
  }, [user, navigate]);
  const [step, setStep] = useState(1);
  
  // New State for the Image
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    propertyType: '', name: '', description: '', address: '',
    bedrooms: 0, bathrooms: 0, parking: 0, amenities: [], safety: []
  });

  const updateData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item]
    }));
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      // 1. Create FormData object (Required for file uploads)
      const data = new FormData();
      
      // 2. Append text fields
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("description", `Type: ${formData.propertyType}. ${formData.description}`);
      data.append("stars", 5);
      // You can append other fields like user email if needed by your backend logic
      // data.append("ownerEmail", user.email); 

      // 3. Append the File
      if (imageFile) {
        data.append("file", imageFile); // 'file' must match the @RequestParam in Spring Boot
      } else {
        alert("Please upload a cover photo!");
        return;
      }

      // 4. Send to API
      await api.createHotel(data);
      alert("Property Listed Successfully!");
      navigate('/host/properties'); 
    } catch (error) {
      console.error(error);
      alert("Failed to list property. Check console for details."); 
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 flex justify-center pb-20">
      <main className="w-full max-w-[800px] p-8">
        
        <div className="w-full bg-gray-200 h-2 rounded-full mb-10 overflow-hidden">
            <div className="bg-black h-full transition-all duration-300" style={{width: `${(step/5)*100}%`}}></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-sm relative animate-in fade-in zoom-in-95 duration-300">
            {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="absolute top-10 left-10 text-gray-400 hover:text-black transition-colors">
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Step 1: Type */}
            {step === 1 && (
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-black mb-8">What kind of place will you host?</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {['Apartment', 'Flat', 'Room', 'Villa'].map(type => (
                            <div key={type} onClick={() => updateData('propertyType', type)} 
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-4 hover:border-gray-400 ${formData.propertyType === type ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <span className="font-bold text-sm">{type}</span>
                            </div>
                        ))}
                    </div>
                    <button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold transition-colors disabled:opacity-50" onClick={() => setStep(2)} disabled={!formData.propertyType}>Next</button>
                </div>
            )}

            {/* Step 2: Details & IMAGE UPLOAD */}
            {step === 2 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Describe your place</h1>
                    <div className="space-y-6">
                        <div>
                            <label className="block font-bold text-sm mb-2 text-black">Title</label>
                            <input type="text" className="w-full p-4 border border-gray-300 rounded-xl focus:border-black outline-none transition-colors" placeholder="e.g. Luxury Condo" value={formData.name} onChange={(e) => updateData('name', e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-2 text-black">Address</label>
                            <input type="text" className="w-full p-4 border border-gray-300 rounded-xl focus:border-black outline-none transition-colors" placeholder="Full Address" value={formData.address} onChange={(e) => updateData('address', e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-2 text-black">Description</label>
                            <textarea rows="4" className="w-full p-4 border border-gray-300 rounded-xl focus:border-black outline-none resize-none transition-colors" placeholder="Tell guests about your place..." value={formData.description} onChange={(e) => updateData('description', e.target.value)} />
                        </div>
                        
                        {/* --- IMAGE UPLOAD UI --- */}
                        <div>
                            <label className="block font-bold text-sm mb-2 text-black">Cover Photo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative flex flex-col items-center justify-center gap-2">
                                <input 
                                  type="file" 
                                  onChange={handleFileChange} 
                                  className="absolute inset-0 opacity-0 cursor-pointer" 
                                  accept="image/*" 
                                />
                                <UploadCloud size={32} className="text-gray-400" />
                                <span className="text-sm font-bold text-gray-600">
                                    {imageFile ? imageFile.name : "Click to upload an image"}
                                </span>
                                <span className="text-xs text-gray-400">JPG, PNG, max 5MB</span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8"><button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold" onClick={() => setStep(3)}>Next</button></div>
                    </div>
                </div>
            )}

            {/* Step 3: Facilities */}
            {step === 3 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Add details</h1>
                    <div className="space-y-4">
                        {['bedrooms', 'bathrooms', 'parking'].map(field => (
                            <div key={field} className="flex justify-between items-center p-4 border-b border-gray-100">
                                <span className="font-bold capitalize text-lg text-black">{field}</span>
                                <div className="flex items-center gap-4">
                                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" onClick={() => updateData(field, Math.max(0, formData[field] - 1))}><Minus size={16}/></button>
                                    <span className="font-bold w-4 text-center text-black">{formData[field]}</span>
                                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" onClick={() => updateData(field, formData[field] + 1)}><Plus size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-10"><button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold transition-colors" onClick={() => setStep(4)}>Next</button></div>
                </div>
            )}

            {/* Step 4 & 5: Amenities & Safety */}
            {(step === 4 || step === 5) && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">{step === 4 ? "Amenities" : "Safety Features"}</h1>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {(step === 4 ? ['Wifi', 'TV', 'Kitchen', 'Washer', 'AC', 'Pool'] : ['Smoke Alarm', 'First Aid', 'Fire Extinguisher']).map(item => {
                             const field = step === 4 ? 'amenities' : 'safety';
                             const isSelected = formData[field].includes(item);
                             return (
                                <div key={item} onClick={() => toggleItem(field, item)} className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all hover:border-black ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                    <span className="font-bold text-black">{item}</span>
                                    {isSelected && <Check size={18} className="text-black" />}
                                </div>
                             )
                        })}
                    </div>
                    <div className="flex justify-end mt-8">
                        {step === 4 
                            ? <button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold transition-colors" onClick={() => setStep(5)}>Next</button>
                            : <button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-green-600 transition-colors" onClick={handleSubmit}>Publish</button>
                        }
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}