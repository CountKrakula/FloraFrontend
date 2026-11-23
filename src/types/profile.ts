export type ProfileDto = {
  name: string;
  email: string;
  isEmailConfirmed: boolean;
  isFirstLogin: boolean;
};

export type UpdateProfileDto = {
  name: string;
};

export type UpdateAccountInfoDto = {
  oldPassword?: string;
  newPassword?: string;
};
