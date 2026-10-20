export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IBaseResponse<T = void> {
  success: boolean;
  statusCode: number;
  message: string;
  IMeta?: IMeta;
  data?: T;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

// Auth Flow Types

export interface ILoginPayload {
  email: string;
  password: string;
}

export type ILoginResponse = IBaseResponse<{ token: string }>;

// Forgot Password Types
export interface IForgotPasswordPayload {
  email: string;
}
export type IForgotPasswordResponse = IBaseResponse;

// Resend OTP
export interface IResendOTPReqBody {
  email: string;
}
export type IResendOTPBaseResponse = IBaseResponse;

// Reset Password
export interface IResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}
export type IResetPasswordResponse = IBaseResponse;

// Verify OTP
export interface IVerifyOTPPayload {
  email: string;
  otp: string;
}
export type IVerifyOTPResponse = IBaseResponse<{ message: string }>;

// Profile Update Types
export interface IUpdateProfilePayload {
  name: string;
  phone: string;
  isTwoFactorEnabled?: boolean;
}
export type IUpdateProfileResponse = IBaseResponse;

// User Data Types
export interface IUserData {
  id: string;
  name: string;
  role: "USER" | "ADMIN" | "SUPERADMIN" | string;
  email: string;
  phone?: string;
  location?: string | null;
  expertise?: string[];
  startTime?: string | null;
  endTime?: string | null;
  workingDays?: ("M" | "T" | "W" | "TH" | "F" | "S" | "SU")[];
  isDeleted?: boolean;
  notes?: string | null;
  profileImage?: string | null;
  profilePicture?: string | null;
  password?: string | null;
  resetToken?: string | null;
  resetExpires?: string | null;
  inviteSentAt?: string | null;
  inviteCount?: number;
  isPasswordChanged?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserListData {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IUserData[];
}

export type IUserResponse = IBaseResponse<IUserListData>;
export type IUserRespon = IBaseResponse<IUserData>;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role?: string;
}
