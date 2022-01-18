import API from "./Api";

export default {
  register(credentials) {
    return API().post("register", credentials);
  },
};
