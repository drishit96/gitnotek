export const commonService = {
  isLocalStorageEnabled() {
    const test = "test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  isDarkThemeEnabled() {
    if (this.isLocalStorageEnabled()) {
      const theme = localStorage.getItem("theme");
      if (theme) {
        return theme === "dark";
      } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    }

    return false;
  },

  toggleTheme() {
    if (this.isLocalStorageEnabled()) {
      const theme = localStorage.getItem("theme");
      if (theme) {
        const newTheme = theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }
  },

  extractDomainFromUrl(url: string) {
    let start = url.indexOf("://");
    let domainName = "";
    let domainWithUsernamePassword = "";

    for (let i = start + 3; i < url.length; i++) {
      if (url.charAt(i) !== "/") {
        domainWithUsernamePassword += url.charAt(i);
      } else {
        break;
      }
    }

    const position = domainWithUsernamePassword.indexOf("@");
    if (position !== -1) {
      domainName = domainWithUsernamePassword.substring(position + 1);
    } else {
      domainName = domainWithUsernamePassword;
    }

    return [domainWithUsernamePassword, domainName];
  },
};
