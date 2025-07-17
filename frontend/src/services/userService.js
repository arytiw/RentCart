import API from './axiosConfig';

export const registerUser = async (username, emailId, password, phoneNumber, firstName, lastName, gender,dateOfBirth, address) => {
   const response = await API.post('/register', {
    username,
    emailId,
    password,
    phoneNumber,
    firstName,
    lastName,
    gender,
    dateOfBirth,
    address:{
         addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode
    },
  });
  return response.data;
};

export const loginUser = async (emailId, password) => {
  const response = await API.post('/login', { emailId, password });

  return response.data; // usually contains token or user info
};

export const getAllUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};