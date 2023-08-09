export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.pathname = '/';
};
