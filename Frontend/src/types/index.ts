export type IContextType ={
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUser = {
  id: string;
  email: string;
};

export type INewUser = {
  email: string;
  password: string;
};


export type ILoginUser = {
  email: string;
  password: string;
};