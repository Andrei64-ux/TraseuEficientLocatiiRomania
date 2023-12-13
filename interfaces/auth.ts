export interface LoginInfo {
  email: string;
  password: string;
}

export interface RegisterInfo extends LoginInfo {
  username: string;
}

export interface LoginInfoRedirect extends LoginInfo {
  redirect: string;
}

export interface RegisterInfoRedirect extends RegisterInfo {
  redirect: string;
}
