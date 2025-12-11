import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  ChevronLeft, Check, Plus, Minus, UploadCloud, Home, Building, DoorOpen, 
  Castle, Wifi, Tv, UtensilsCrossed, Zap, Wind, Waves, AlertCircle, 
  Heart, Bed, Bath, ParkingCircle, MapPin
} from 'lucide-react';

export default function AddProperty({ user }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.userType !== 'employee') navigate('/');
  }, [user, navigate]);
  
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({ type: '', count: 1 });

  const [formData, setFormData] = useState({
    propertyType: '', name: '', description: '', address: '',
    bedrooms: 0, bathrooms: 0, parking: 0, rooms: [], amenities: [], safety: []
  });

  const propertyTypes = [
    { name: 'Apartment', icon: Building },
    { name: 'Flat', icon: Home },
    { name: 'Room', icon: DoorOpen },
    { name: 'Villa', icon: Castle }
  ];

  const roomTypes = ['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Studio'];

  const amenitiesList = [
    { name: 'Wifi', icon: Wifi },
    { name: 'TV', icon: Tv },
    { name: 'Kitchen', icon: UtensilsCrossed },
    { name: 'Washer', icon: Zap },
    { name: 'AC', icon: Wind },
    { name: 'Pool', icon: Waves }
  ];

  const safetyList = [
    { name: 'Smoke Alarm', icon: AlertCircle },
    { name: 'First Aid', icon: Heart },
    { name: 'Fire Extinguisher', icon: AlertCircle }
  ];

  const updateData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item]
    }));
  };

  const addRoom = () => {
    if (currentRoom.type) {
      setRooms([...rooms, currentRoom]);
      setCurrentRoom({ type: '', count: 1 });
    }
  };

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("description", `Type: ${formData.propertyType}. ${formData.description}`);
      data.append("stars", 5);

      // --- LINK TO PARTNER ---
      if (user && user.uniqueID) {
          data.append("ownerId", user.uniqueID);
      } else {
          alert("User session invalid. Please log in again.");
          return;
      }

      if (imageFile) {
        data.append("file", imageFile);
      } else {
        alert("Please upload a cover photo!");
        return;
      }

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
            <div className="bg-black h-full transition-all duration-300" style={{width: `${(step/6)*100}%`}}></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-sm relative animate-in fade-in zoom-in-95 duration-300">
            {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="absolute top-10 left-10 text-gray-400 hover:text-black transition-colors">
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Step 1: Property Type */}
            {step === 1 && (
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-black mb-3">What kind of place will you host?</h1>
                    <p className="text-gray-600 mb-10 text-lg">Choose the type of property you're listing</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {propertyTypes.map(({ name, icon: Icon }) => (
                            <div 
                              key={name} 
                              onClick={() => updateData('propertyType', name)} 
                              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-4 hover:border-gray-400 ${formData.propertyType === name ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                                <Icon size={32} className={formData.propertyType === name ? 'text-black' : 'text-gray-400'} />
                                <span className="font-bold text-sm">{name}</span>
                            </div>
                        ))}
                    </div>
                    <button 
                      className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50" 
                      onClick={() => setStep(2)} 
                      disabled={!formData.propertyType}>
                      Next
                    </button>
                </div>
            )}

            {/* Step 2: Basic Details & Image Upload */}
            {step === 2 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Describe your place</h1>
                    <div className="space-y-6">
                        <div>
                            <label className="block font-bold text-sm mb-2 text-black">Title</label>
                            <input 
                              type="text" 
                              className="w-full p-4 border border-gray-300 rounded-xl focus:border-black outline-none transition-colors" 
                              placeholder="e.g. Luxury Condo" 
                              value={formData.name} 
                              onChange={(e) => updateData('name', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-2 text-black flex items-center gap-2">
                              <MapPin size={18} /> Address
                            </label>
                            <input 
                              type="text" 
                              className="w-full p-4 border border-gray-300 rounded-xl focus:border-black outline-none transition-colors" 
                              placeholder="Full Address" 
                              value={formData.address} 
                              onChange={(e) => updateData('address', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-2 text-black">Description</label>
                            <textarea 
                              rows="4" 
                              className="w-full p-4 border border-gray-300 rounded-xl focus:border-black outline-none resize-none transition-colors" 
                              placeholder="Tell guests about your place..." 
                              value={formData.description} 
                              onChange={(e) => updateData('description', e.target.value)} 
                            />
                        </div>
                        
                        {/* Image Upload */}
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

                        <div className="flex justify-end mt-8">
                          <button 
                            className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50" 
                            onClick={() => setStep(3)}
                            disabled={!formData.name || !formData.address || !imageFile}>
                            Next
                          </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Room Types */}
            {step === 3 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Add Room Types</h1>
                    <p className="text-gray-600 text-center mb-8">Select and configure your available room types</p>
                    
                    <div className="space-y-6">
                        {/* Room Selection */}
                        <div>
                            <label className="block font-bold text-sm mb-3 text-black">Select Room Type</label>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {roomTypes.map(type => (
                                <button
                                  key={type}
                                  onClick={() => setCurrentRoom({ ...currentRoom, type })}
                                  className={`p-3 rounded-lg border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                    currentRoom.type === type 
                                      ? 'border-black bg-gray-50 text-black' 
                                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                  }`}>
                                  <Bed size={16} />
                                  {type}
                                </button>
                              ))}
                            </div>
                        </div>

                        {/* Room Count */}
                        <div>
                            <label className="block font-bold text-sm mb-3 text-black">Number of Rooms</label>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg w-fit">
                              <button 
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" 
                                onClick={() => setCurrentRoom({ ...currentRoom, count: Math.max(1, currentRoom.count - 1) })}>
                                <Minus size={16}/>
                              </button>
                              <span className="font-bold text-xl text-black w-8 text-center">{currentRoom.count}</span>
                              <button 
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" 
                                onClick={() => setCurrentRoom({ ...currentRoom, count: currentRoom.count + 1 })}>
                                <Plus size={16}/>
                              </button>
                            </div>
                        </div>

                        {/* Add Room Button */}
                        <button
                          onClick={addRoom}
                          disabled={!currentRoom.type}
                          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                          <Plus size={18} /> Add Room Type
                        </button>

                        {/* List of Added Rooms */}
                        {rooms.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-black">Added Rooms:</h3>
                            {rooms.map((room, index) => (
                              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                  <Bed size={20} className="text-black" />
                                  <span className="font-bold text-black">{room.type} x {room.count}</span>
                                </div>
                                <button
                                  onClick={() => removeRoom(index)}
                                  className="text-red-600 font-bold hover:bg-red-50 px-3 py-1 rounded transition-colors">
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end mt-8">
                          <button 
                            className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50" 
                            onClick={() => setStep(4)}
                            disabled={rooms.length === 0}>
                            Next
                          </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Facilities */}
            {step === 4 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Add Facilities</h1>
                    <div className="space-y-6">
                        {['bedrooms', 'bathrooms', 'parking'].map(field => {
                          const icons = { bedrooms: Bed, bathrooms: Bath, parking: ParkingCircle };
                          const Icon = icons[field];
                          return (
                            <div key={field} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <Icon size={24} className="text-black" />
                                  <span className="font-bold capitalize text-lg text-black">{field}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" 
                                      onClick={() => updateData(field, Math.max(0, formData[field] - 1))}>
                                      <Minus size={16}/>
                                    </button>
                                    <span className="font-bold w-6 text-center text-black text-lg">{formData[field]}</span>
                                    <button 
                                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" 
                                      onClick={() => updateData(field, formData[field] + 1)}>
                                      <Plus size={16}/>
                                    </button>
                                </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="flex justify-end mt-10">
                      <button 
                        className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors" 
                        onClick={() => setStep(5)}>
                        Next
                      </button>
                    </div>
                </div>
            )}

            {/* Step 5: Amenities */}
            {step === 5 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Amenities</h1>
                    <p className="text-gray-600 text-center mb-8">Select all amenities available at your property</p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {amenitiesList.map(({ name, icon: Icon }) => {
                             const isSelected = formData.amenities.includes(name);
                             return (
                                <div 
                                  key={name} 
                                  onClick={() => toggleItem('amenities', name)} 
                                  className={`p-4 border-2 rounded-lg cursor-pointer flex items-center gap-3 transition-all hover:border-gray-400 ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                    <Icon size={20} className={isSelected ? 'text-black' : 'text-gray-400'} />
                                    <span className="font-bold text-black">{name}</span>
                                    {isSelected && <Check size={18} className="text-black ml-auto" />}
                                </div>
                             );
                        })}
                    </div>
                    <div className="flex justify-end mt-8">
                      <button 
                        className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors" 
                        onClick={() => setStep(6)}>
                        Next
                      </button>
                    </div>
                </div>
            )}

            {/* Step 6: Safety Features */}
            {step === 6 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Safety Features</h1>
                    <p className="text-gray-600 text-center mb-8">Tell guests what safety features your property has</p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {safetyList.map(({ name, icon: Icon }) => {
                             const isSelected = formData.safety.includes(name);
                             return (
                                <div 
                                  key={name} 
                                  onClick={() => toggleItem('safety', name)} 
                                  className={`p-4 border-2 rounded-lg cursor-pointer flex items-center gap-3 transition-all hover:border-gray-400 ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                    <Icon size={20} className={isSelected ? 'text-black' : 'text-gray-400'} />
                                    <span className="font-bold text-black">{name}</span>
                                    {isSelected && <Check size={18} className="text-black ml-auto" />}
                                </div>
                             );
                        })}
                    </div>
                    <div className="flex justify-end mt-8">
                      <button 
                        className="bg-green-600 text-white px-10 py-3 rounded-full font-bold hover:bg-green-700 transition-colors flex items-center gap-2" 
                        onClick={handleSubmit}>
                        <Check size={20} /> Publish Property
                      </button>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}