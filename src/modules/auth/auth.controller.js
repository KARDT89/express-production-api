import ApiResponse from '../../common/utils/api-response.js';
import * as authService from './auth.service.js';
import ApiError from '../../common/utils/api-error.js';

const register = async (req, res) => {
  //something
  const user = await authService.register(req.body);
  ApiResponse.created(res, 'Registration success', user);
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  ApiResponse.ok(res, 'Login successful', { user, accessToken });
};

const logout = async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  ApiResponse.ok(res, 'Logout successful');
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.ok(res, 'User fetched successfully', user);
};

const verifyEmail = async (req, res) => {
  // const user = await authService.verifyEmail(req.params.token)
  // ApiResponse.ok(res, "Email verified successfully", user)
};

export { register, login, logout, getMe, verifyEmail };
