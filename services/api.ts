import { ContactFormData, ApiResponse } from '../types';

// Simulate a backend API call
export const submitContactForm = async (data: ContactFormData): Promise<ApiResponse> => {
  // In a real app, this would be:
  // const response = await fetch('http://localhost:3000/api/contact', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return response.json();

  return new Promise((resolve) => {
    console.log("Sending data to Node/Express backend:", data);
    
    setTimeout(() => {
      resolve({
        success: true,
        message: "Message received! We will get back to you shortly."
      });
    }, 1500); // Simulate network delay
  });
};