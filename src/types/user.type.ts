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
export interface UserInfo {
    id: string,
    email: string,
    username: string,
    avatar: string,
    bio: string,
    role: string,
    favoriteRecipes : string[],
    createdAt: string,
    
}

export interface UserRes {
    token: string;
    user: UserInfo;
}