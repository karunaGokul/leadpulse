export class AuthenticationRequest {
    username?: string;
    password?: string;
    grant_type: string = "password";
    refresh_token?: string;
}
export class AuthenticationResponse {
    accessToken: string;
    refreshToken: string;
    success: boolean;
    error: string;
}
export class VerifyOTPRequest {
    phone: string;
}
export class AuthenticationState {
    accessToken: string = "";
    refreshToken: string = "";
}
export class ForgotPasswordRequest {
    smail: string;
}
export class ForgotPasswordResponse {
    email: string;
    firstName: string;
}
export class UpdatePasswordRequest {
    password: string;
    confirmPassword: string;
}
export class UpdatePasswordResponse {
}
export class ChangePasswordRequest {
    currentPassword: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
}