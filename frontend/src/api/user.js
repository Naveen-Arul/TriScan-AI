import apiClient from './apiClient';

export const getProfile = async () => {
  const response = await apiClient('/api/user/me', {
    method: 'GET',
  });
  return response;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient('/api/user/update', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return response;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient('/api/user/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return response;
};
