export const AuthService = () => {
  const login = async () => {
    console.log('login');
  };

  const logout = async () => {
    console.log('logout');
  };

  return {
    login,
    logout
  };
};

