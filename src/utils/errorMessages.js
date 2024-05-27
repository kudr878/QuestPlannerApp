import { verifyPassword } from "../../redux/authSlice";

export const validateUsername = (username, currentUser) => {
  if (!username) {
    return 'Введите новое имя пользователя';
  } else if (username === currentUser) {
    return 'Новое имя пользователя должно отличаться от текущего';
  }
};

export const validateEmail = (email, currentUserEmail) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Введите адрес электронной почты';
  } else if (email === currentUserEmail) {
    return 'Новый адрес электронной почты должен отличаться от текущего';
  } else if (!emailRegex.test(email)) {
    return 'Некорректный адрес электронной почты';
  }
  return null;
};

export const validateCurrentPassword = async (dispatch, username, password) => {
  const value = await dispatch(verifyPassword({ username, password }));
  if (value.error) {
    return 'Введите ваш текущий пароль';
  } 
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Введите новый пароль';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword || !confirmPassword) {
    return 'Пароли не совпадают';
  } 
  return null;
};