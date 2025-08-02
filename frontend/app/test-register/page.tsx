'use client';

import { useState } from 'react';
import { buildUrl, API_CONFIG } from '../config/api';

export default function TestRegister() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!formData.username || !formData.firstName || !formData.emailId || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.emailId)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate first name (letters and spaces only)
    const firstNameRegex = /^[A-Za-z][A-Za-z\s]*$/;
    if (!firstNameRegex.test(formData.firstName)) {
      alert('First name must contain only letters and spaces');
      return;
    }

    // Validate last name (if provided)
    if (formData.lastName) {
      const lastNameRegex = /^[A-Za-z][A-Za-z ]{0,29}$/;
      if (!lastNameRegex.test(formData.lastName)) {
        alert('Last name must be up to 30 characters, only letters and spaces');
        return;
      }
    }

    // Validate gender (if provided)
    if (formData.gender && !['Male', 'Female', 'Other'].includes(formData.gender)) {
      alert('Gender must be Male, Female, or Other');
      return;
    }

    setLoading(true);
    try {
      const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.REGISTER);
      console.log('Testing registration with URL:', url);
      
      // Build payload
      const payload: any = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName || '',
        emailId: formData.emailId,
        password: formData.password,
        phoneNumber: formData.phoneNumber || '',
        gender: formData.gender || '',
        dateOfBirth: formData.dateOfBirth || ''
      };

      // Only include address if user provided address information
      const hasAddressInfo = formData.addressLine1 || formData.addressLine2 || formData.city || formData.state || formData.country || formData.postalCode;
      if (hasAddressInfo) {
        payload.address = {
          addressLine1: formData.addressLine1 || '',
          addressLine2: formData.addressLine2 || '',
          city: formData.city || '',
          state: formData.state || '',
          country: formData.country || '',
          postalCode: formData.postalCode || ''
        };
      }
      
      console.log('Payload:', payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
                   let data;
             try {
               data = await response.json();
             } catch (parseError) {
               data = await response.text();
             }
             
             setResult({
               status: response.status,
               ok: response.ok,
               data: data,
               url: url
             });
    } catch (error: any) {
      setResult({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Registration Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Registration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter last name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm password"
              />
            </div>
          </div>
          
          {/* Address Fields */}
          <div className="mt-6 border-t pt-4">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Address Line 1
                 </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter address line 1"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Address Line 2
                 </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter address line 2"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   City
                 </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter city"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   State
                 </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter state"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Country
                 </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter country"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Postal Code
                 </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={testRegister}
            disabled={loading}
            className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Registration'}
          </button>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="space-x-4">
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Register Page
            </a>
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Login Page
            </a>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 