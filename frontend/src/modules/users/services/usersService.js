import { api } from "../../../shared/services/api.js";

export const usersService = {
  list() {
    return api.get("/users");
  },
  create(payload) {
    return api.post("/users", payload);
  },
  update(id, payload) {
    return api.patch(`/users/${id}`, payload);
  },
  remove(id) {
    return api.delete(`/users/${id}`);
  },
};
