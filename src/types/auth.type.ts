import { UserInfo } from "./user.type";

export interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: UserInfo, token: string) => Promise<void>;
  register: (dto: RegisterReq) => Promise<boolean>;
  login: (dto: LoginReq) => Promise<string>;
  logout: () => Promise<boolean>;
}

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