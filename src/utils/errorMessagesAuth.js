import { verifyPassword } from "../../redux/authSlice";

export const validateUsername = (username, currentUser) => {
  if (!username) {
    return 'EMPTY_FIELD'; 
  } else if (username === currentUser) {
    return 'Новое имя пользователя должно отличаться от текущего';
  }
  return null;
};

export const validateEmail = (email, currentUserEmail) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'EMPTY_FIELD'; 
  } else if (email === currentUserEmail) {
    return 'Новый адрес электронной почты должен отличаться от текущего';
  } else if (!emailRegex.test(email)) {
    return 'Некорректный адрес электронной почты';
  }
  return null;
};

export const validateCurrentPassword = async (dispatch, username, password) => {
  if (!password) {
    return 'EMPTY_FIELD'; 
  }
  const value = await dispatch(verifyPassword({ username, password }));
  if (value.error) {
    return 'Введите ваш текущий пароль';
  }
  return null;
};

export const validatePassword = (password, oldPassword) => {
  if (!password || password.trim() === '') {
    return 'EMPTY_FIELD'; 
  } else if (password === oldPassword) {
    return 'Новый пароль не должен совпадать со старым';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'EMPTY_FIELD'; 
  } else if (password !== confirmPassword) {
    return 'Пароли не совпадают';
  }
  return null;
};
