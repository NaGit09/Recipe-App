export class LoginReq {
    email: string;
    password: string;
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}
export class RegisterReq {
    email: string;
    password: string;
    username: string;
    constructor(email: string, password: string, username: string) {
        this.email = email;
        this.password = password;
        this.username = username;
    }
}
export interface AuthInfo {
    fullname: string,
    username: string,
    id : string
}
export interface auth {
    userId: string,
    accessToken: string
    refreshToken: string
}