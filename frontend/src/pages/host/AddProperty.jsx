import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { 
  ChevronLeft, Check, Plus, Minus, UploadCloud, 
  Building2, Home, BedDouble, Palmtree, 
  Wifi, Tv, Utensils, Shirt, Wind, Waves, 
  Bell, BriefcaseMedical, Flame, MapPin, Loader, Bed, Trash2
} from 'lucide-react';

export default function AddProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isEditing = !!id; 
  
  useEffect(() => {
    if (!user || user.userType !== 'employee') {
       navigate('/');
    }
  }, [user, navigate]);

  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableRoomTypes, setAvailableRoomTypes] = useState([]); 
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({ type: '', count: 1 });

  const [formData, setFormData] = useState({
    propertyType: '', name: '', description: '', address: '',
    bedrooms: 0, bathrooms: 0, parking: 0, amenities: [], safety: []
  });

  // Load Room Types
  useEffect(() => {
    api.getRoomTypes()
      .then(data => setAvailableRoomTypes(data))
      .catch(err => console.error("Failed to load room types", err));
  }, []);

  // Pre-fill if editing
  useEffect(() => {
    if (isEditing) {
      const loadHotel = async () => {
        let hotelData = location.state?.hotel;
        if (!hotelData) {
          try {
             hotelData = await api.getHotelById(id);
          } catch(err) {
             console.error(err);
             alert("Failed to load hotel details");
             navigate('/host/properties');
             return;
          }
        }
        if (hotelData) {
            setFormData(prev => ({
                ...prev,
                name: hotelData.name || '',
                address: hotelData.address || '',
                description: "Description not stored in database",
                propertyType: 'Apartment', 
            }));
            setStep(2);
        }
      };
      loadHotel();
    }
  }, [isEditing, id, location.state, navigate]);

  // --- CONFIG ARRAYS ---
  const propertyTypes = [
    { name: 'Apartment', icon: Building2 },
    { name: 'Flat', icon: Home },
    { name: 'Room', icon: BedDouble },
    { name: 'Villa', icon: Palmtree }
  ];

  const amenitiesList = [
    { name: 'Wifi', icon: Wifi },
    { name: 'TV', icon: Tv },
    { name: 'Kitchen', icon: Utensils },
    { name: 'Washer', icon: Shirt },
    { name: 'AC', icon: Wind },
    { name: 'Pool', icon: Waves }
  ];

  const safetyList = [
    { name: 'Smoke Alarm', icon: Bell },
    { name: 'First Aid', icon: BriefcaseMedical },
    { name: 'Fire Extinguisher', icon: Flame }
  ];

  const updateData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item]
    }));
  };

  const addRoom = () => {
    if (currentRoom.type) {
      const existingIndex = rooms.findIndex(r => r.type === currentRoom.type);
      if (existingIndex >= 0) {
          const updatedRooms = [...rooms];
          updatedRooms[existingIndex].count += currentRoom.count;
          setRooms(updatedRooms);
      } else {
          setRooms([...rooms, currentRoom]);
      }
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
    setLoading(true);
    try {
      if (isEditing) {
          // Update Logic
          const payload = {
              name: formData.name,
              address: formData.address,
          };
          await api.updateHotel(id, payload);
          alert("Property Updated Successfully!");
      } else {
          // Create Logic
          const data = new FormData();
          data.append("name", formData.name);
          data.append("address", formData.address);
          
          const roomSummary = rooms.map(r => `${r.type} x${r.count}`).join(', ');
          data.append("description", `Type: ${formData.propertyType}. ${formData.description}. Rooms: ${roomSummary}`);
          data.append("stars", 5);

          if (user && user.uniqueID) {
              data.append("ownerId", user.uniqueID);
          } else {
              throw new Error("Session invalid");
          }

          if (imageFile) {
            data.append("file", imageFile); 
          } else {
            alert("Please upload a cover photo!");
            setLoading(false);
            return;
          }

          // 1. Create Hotel
          const newHotel = await api.createHotel(data);
          
          // 2. Create Rooms associated with this Hotel
          if (newHotel && newHotel.hotelID && rooms.length > 0) {
              for (const roomGroup of rooms) {
                  // Find the type ID for this room name
                  const typeObj = availableRoomTypes.find(t => t.name === roomGroup.type);
                  if (typeObj) {
                      // Create individual room entries based on count
                      for (let i = 0; i < roomGroup.count; i++) {
                          const roomPayload = {
                              hotel: { hotelID: newHotel.hotelID },
                              roomType: { typeID: typeObj.typeID },
                              status: "Available"
                          };
                          await api.createRoom(roomPayload);
                      }
                  }
              }
          }

          alert("Property and Rooms Listed Successfully!");
      }
      
      navigate('/host/properties'); 
    } catch (error) {
      console.error(error);
      alert(isEditing ? "Failed to update property." : "Failed to list property."); 
    } finally {
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen pt-20 flex justify-center pb-20">
      <main className="w-full max-w-[800px] p-8">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-10 overflow-hidden">
            <div className="bg-black h-full transition-all duration-300" style={{width: `${(step/6)*100}%`}}></div>
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
                    <h1 className="text-3xl font-bold text-black mb-8">{isEditing ? "Edit Property Type" : "What kind of place will you host?"}</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {propertyTypes.map(({ name, icon: Icon }) => (
                            <div key={name} onClick={() => updateData('propertyType', name)} 
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-4 hover:border-gray-400 ${formData.propertyType === name ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.propertyType === name ? 'bg-gold/20' : 'bg-gray-100'}`}>
                                    <Icon size={24} className={formData.propertyType === name ? 'text-black' : 'text-gray-500'} />
                                </div>
                                <span className="font-bold text-sm">{name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold transition-colors disabled:opacity-50" onClick={() => setStep(2)} disabled={!formData.propertyType}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 2: Details & Image */}
            {step === 2 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">{isEditing ? "Edit Details" : "Describe your place"}</h1>
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
                        
                        {!isEditing && (
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
                        )}

                        <div className="flex justify-end mt-8"><button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold" onClick={() => setStep(3)}>Next</button></div>
                    </div>
                </div>
            )}

            {/* Step 3: Room Configuration */}
            {step === 3 && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">Add Rooms</h1>
                    <div className="space-y-6">
                        {/* Type Selector */}
                        <div>
                            <label className="block font-bold text-sm mb-3 text-black">Select Room Type</label>
                            {availableRoomTypes.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                {availableRoomTypes.map(rt => (
                                    <button
                                    key={rt.typeID}
                                    onClick={() => setCurrentRoom({ ...currentRoom, type: rt.name })}
                                    className={`p-3 rounded-lg border-2 font-bold text-sm transition-all ${
                                        currentRoom.type === rt.name ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}>
                                    {rt.name}
                                    </button>
                                ))}
                                </div>
                            ) : (
                                <p className="text-red-500 text-sm">No room types found.</p>
                            )}
                        </div>

                        {/* Count Selector */}
                        <div>
                            <label className="block font-bold text-sm mb-3 text-black">Number of Rooms</label>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg w-fit">
                              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" onClick={() => setCurrentRoom({ ...currentRoom, count: Math.max(1, currentRoom.count - 1) })}><Minus size={16}/></button>
                              <span className="font-bold text-xl text-black w-8 text-center">{currentRoom.count}</span>
                              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors" onClick={() => setCurrentRoom({ ...currentRoom, count: currentRoom.count + 1 })}><Plus size={16}/></button>
                            </div>
                        </div>

                        <button onClick={addRoom} disabled={!currentRoom.type} className="w-full bg-black text-white py-3 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                          <Plus size={18} /> Add Room Config
                        </button>

                        {/* Added List */}
                        {rooms.length > 0 && (
                          <div className="space-y-3 mt-4">
                            <h3 className="font-bold text-black">Added Configuration:</h3>
                            {rooms.map((room, index) => (
                              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Bed size={20} className="text-black" />
                                    <span className="font-bold text-black">{room.type} <span className="text-gray-500 text-sm">x{room.count}</span></span>
                                </div>
                                <button onClick={() => removeRoom(index)} className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors">
                                    <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end mt-8">
                          <button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold disabled:opacity-50" onClick={() => setStep(4)} disabled={rooms.length === 0 && !isEditing}>Next</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Facilities */}
            {step === 4 && (
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
                    <div className="flex justify-end mt-10"><button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold transition-colors" onClick={() => setStep(5)}>Next</button></div>
                </div>
            )}

            {/* Step 5 & 6: Amenities & Safety */}
            {(step === 5 || step === 6) && (
                <div>
                    <h1 className="text-3xl font-bold text-black mb-8 text-center">{step === 5 ? "Amenities" : "Safety Features"}</h1>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {(step === 5 ? amenitiesList : safetyList).map(({ name, icon: Icon }) => {
                             const field = step === 5 ? 'amenities' : 'safety';
                             const isSelected = formData[field].includes(name);
                             return (
                                <div key={name} onClick={() => toggleItem(field, name)} className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all hover:border-black ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className={isSelected ? 'text-black' : 'text-gray-400'} />
                                        <span className={`font-bold ${isSelected ? 'text-black' : 'text-gray-500'}`}>{name}</span>
                                    </div>
                                    {isSelected && <Check size={18} className="text-black" />}
                                </div>
                             )
                        })}
                    </div>
                    <div className="flex justify-end mt-8">
                        {step === 5 
                            ? <button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gold transition-colors" onClick={() => setStep(6)}>Next</button>
                            : <button 
                                className="bg-green-600 text-white px-10 py-3 rounded-full font-bold hover:bg-green-700 transition-colors flex items-center gap-2" 
                                onClick={handleSubmit}
                                disabled={loading}
                              >
                                {loading ? <Loader size={20} className="animate-spin"/> : <Check size={20} />} 
                                {isEditing ? "Update Property" : "Publish Property"}
                              </button>
                        }
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}