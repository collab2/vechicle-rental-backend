const supabase = require("../config/supabase");

module.exports = {
  getAllData: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getDataById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .eq("userId", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createUser: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .insert([data])
        .select("*")
        .then((result) => {
          if (!result.error) {
            console.log(result);
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateUser: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .update(data)
        .eq("userId", id)
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteUser: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .delete()
        .eq("userId", id)
        .select(
          "userId, name, gender, profession, nationality, dateOfBirth, phoneNumber, role, createdAt, updatedAt"
        )
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCountUser: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
};
