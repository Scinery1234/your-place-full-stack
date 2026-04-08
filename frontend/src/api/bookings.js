import apiClient from './client';

export const createBooking = (bookingData) => {
  return apiClient.post('/bookings', bookingData);
};

export const getMyBooking = (scope = 'mine') => {
  return apiClient.get('/bookings', { params: { scope } });
};

export const getBookingById = (id) => {
  return apiClient.get(`/bookings/${id}`);
};

export const updateBooking = (id, bookingData) => {
  return apiClient.patch(`/bookings/${id}`, bookingData);
};
export const deleteBooking = (id) => {
  return apiClient.delete(`/bookings/${id}`);
};
