type AuthObj = {
  username: "token";
  password: string;
};

export const authService = {
  actko: "",
  username: "",

  setActko(actko: string) {
    this.actko = actko;
  },

  setUserName(userName: string) {
    this.username = userName;
  },

  isAuthenticated() {
    return !!this.actko;
  },

  getAuthTko() {
    try {
      return this.actko;
    } catch (error) {
      return "";
    }
  },

  getUsername() {
    return this.username;
  },

  lookupSavedAuth(): AuthObj | null {
    if (this.actko) {
      return {
        username: "token",
        password: this.actko,
      };
    }

    return null;
  },
};
