export class LoginReq {
    email: string;
    password: string;
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}
export interface AuthInfo {
    fullname: string,
    username: string,
    id : string
}
export interface auth {
    info: AuthInfo
    accessToken: string
    refreshToken: string
}