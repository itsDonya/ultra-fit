const errorPersianMessage = (errorMessage) => {
  switch (errorMessage) {
    case "UserNotFound":
      return "کاربری با این مشصخات در سامانه یافت نشد";
    case "WrongPassword":
      return "رمز عبور اشتباه می‌باشد";
  }
};
