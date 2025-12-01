// src/pages/AddHotel.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './AddProperty.css';

export default function AddProperty({ user }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Store all form data
  const [formData, setFormData] = useState({
    propertyType: '', // Step 1
    name: '',         // Step 2 (Title)
    description: '',  // Step 2
    address: '',      // Step 2
    bedrooms: 0,      // Step 3
    bathrooms: 0,     // Step 3
    parking: 0,       // Step 3
    amenities: [],    // Step 4
    safety: []        // Step 5
  });

  // Helper to update state
  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleItem = (field, item) => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(item)) {
        return { ...prev, [field]: list.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...list, item] };
      }
    });
  };

  // Final Submit
  const handleSubmit = async () => {
    try {
      // Convert wizard data to your API format
      const apiPayload = {
        name: formData.name,
        address: formData.address,
        // We use 'description' field for the combined description + type for now
        // In a real app, you'd add new columns to your DB
        description: `Type: ${formData.propertyType}. ${formData.description}`,
        stars: 5, 
      };
      
      await api.createHotel(apiPayload);
      alert("Property Listed Successfully!");
      navigate('/search'); 
    } catch (error) {
      alert("Failed to list property.");
    }
  };

  return (
    <div className="add-hotel-page">
      {/* REMOVED: <Header /> */}
      
      <main className="wizard-container">
        
        {/* --- STEP 1: PROPERTY TYPE --- */}
        {step === 1 && (
          <div className="wizard-step fade-in">
            <h1>What kind of place will you host?</h1>
            <div className="grid-options">
              {['Apartment', 'Flat', 'Room', 'Villa'].map(type => (
                <div 
                  key={type}
                  className={`option-card ${formData.propertyType === type ? 'selected' : ''}`}
                  onClick={() => updateData('propertyType', type)}
                >
                  <div className="option-placeholder"></div>
                  <span>{type}</span>
                </div>
              ))}
            </div>
            <button className="next-btn" onClick={() => setStep(2)} disabled={!formData.propertyType}>Next</button>
          </div>
        )}

        {/* --- STEP 2: DESCRIPTION --- */}
        {step === 2 && (
          <div className="wizard-step fade-in">
            <h1>Add a short description of your place.</h1>
            
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                placeholder="e.g. Luxury Condo in Cebu" 
                value={formData.name}
                onChange={(e) => updateData('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                placeholder="Full Address" 
                value={formData.address}
                onChange={(e) => updateData('address', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                rows="4" 
                placeholder="Tell guests about your place..." 
                value={formData.description}
                onChange={(e) => updateData('description', e.target.value)}
              />
            </div>
            
            <div className="wizard-actions">
              <button className="back-btn-text" onClick={() => setStep(1)}>Back</button>
              <button className="next-btn" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {/* --- STEP 3: FACILITIES --- */}
        {step === 3 && (
          <div className="wizard-step fade-in">
            <h1>Add facilities available at your place.</h1>
            
            <div className="counter-row">
               <span>Bedrooms</span>
               <div className="counter-controls">
                 <button onClick={() => updateData('bedrooms', Math.max(0, formData.bedrooms - 1))}>-</button>
                 <span>{formData.bedrooms}</span>
                 <button onClick={() => updateData('bedrooms', formData.bedrooms + 1)}>+</button>
               </div>
            </div>

            <div className="counter-row">
               <span>Bathrooms</span>
               <div className="counter-controls">
                 <button onClick={() => updateData('bathrooms', Math.max(0, formData.bathrooms - 1))}>-</button>
                 <span>{formData.bathrooms}</span>
                 <button onClick={() => updateData('bathrooms', formData.bathrooms + 1)}>+</button>
               </div>
            </div>

            <div className="counter-row">
               <span>Parking</span>
               <div className="counter-controls">
                 <button onClick={() => updateData('parking', Math.max(0, formData.parking - 1))}>-</button>
                 <span>{formData.parking}</span>
                 <button onClick={() => updateData('parking', formData.parking + 1)}>+</button>
               </div>
            </div>

            <div className="wizard-actions">
              <button className="back-btn-text" onClick={() => setStep(2)}>Back</button>
              <button className="next-btn" onClick={() => setStep(4)}>Next</button>
            </div>
          </div>
        )}

        {/* --- STEP 4: AMENITIES --- */}
        {step === 4 && (
          <div className="wizard-step fade-in">
            <h1>Add amenities available at your place.</h1>
            <div className="grid-options small">
              {['Television', 'Wifi', 'Washer', 'Balcony', 'Cleaner', 'Radio', 'Lift', 'Other'].map(item => (
                <div 
                  key={item}
                  className={`option-card ${formData.amenities.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleItem('amenities', item)}
                >
                  <div className="option-placeholder small"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="back-btn-text" onClick={() => setStep(3)}>Back</button>
              <button className="next-btn" onClick={() => setStep(5)}>Next</button>
            </div>
          </div>
        )}

        {/* --- STEP 5: SAFETY --- */}
        {step === 5 && (
          <div className="wizard-step fade-in">
            <h1>Add safety available at your place.</h1>
            <div className="grid-options small">
              {['Sanitizers', 'Fire Extinguisher', 'First Aid', 'Smoke Detector'].map(item => (
                <div 
                  key={item}
                  className={`option-card ${formData.safety.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleItem('safety', item)}
                >
                  <div className="option-placeholder small"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="back-btn-text" onClick={() => setStep(4)}>Back</button>
              <button className="next-btn finish" onClick={handleSubmit}>Post My Property</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}