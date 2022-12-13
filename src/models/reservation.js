const connection = require("../config/postgresql");
const supabase = require("../config/supabase");

module.exports = {
  createReservation: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO reservation (location, "startDate", "returnDate", "paymentMethods", "quantity", "reservationDate", "statusPayment", "userId", "productId", "amount") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          data.location,
          data.startDate,
          data.returnDate,
          data.paymentMethod,
          data.quantity,
          data.reservationDate,
          data.statusPayment,
          data.userId,
          data.productId,
          data.amount,
        ],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getLastReservation: () =>
    new Promise((resolve, reject) => {
      connection.query(
        ` SELECT "reservationId", amount
        FROM reservation
        ORDER BY "createdAt" DESC
        LIMIT 1`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(result);
          }
        }
      );
    }),
  getCountReservation: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT ("reservationId") FROM reservation`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getCountReservationById: (reservationId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT("reservationId") FROM Reservation WHERE "reservationId"= $1`,
        [reservationId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getCountAllReservationName: (userId, nameProduct = "") =>
    new Promise((resolve, reject) => {
      supabase
        .from("reservation")
        .select("*, product(*)", { count: "exact" })
        .eq("userId", userId)
        .ilike("product.nameproduct", `%${nameProduct}%`)
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllReservation: (limit, offset, date, name = "", category = "") =>
    new Promise((resolve, reject) => {
      if (date) {
        connection.query(
          `SELECT reservation."createdAt", product.nameproduct, product.category FROM reservation join product on (product."productId" = reservation."productId") WHERE CAST((reservation."createdAt" AT TIME ZONE 'UTC') AS date) = DATE '${date}' AND  product.nameproduct ilike '%${name}%' OR product.category = '${category}' LIMIT ${limit} OFFSET ${offset}`,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(new Error(error));
            }
          }
        );
      } else {
        connection.query(
          `SELECT * FROM reservation join product on (product."productId" = reservation."productId") WHERE product.nameproduct ilike '%${name}%' OR product.category = '%${category}%' LIMIT ${limit} OFFSET ${offset}`,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(new Error(error));
            }
          }
        );
      }
    }),
  getReservationById: (reservationId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM Reservation WHERE "reservationId"=$1`,
        [reservationId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getReservationByUserId: (
    userId,
    nameProduct = "",
    offset = 0,
    limit = 4,
    asc = true
  ) =>
    new Promise((resolve, reject) => {
      supabase
        .from("reservation")
        .select(
          `paymentMethods,startDate, returnDate, statusPayment, product(*)`
        )
        .eq("userId", userId)
        .range(offset, offset + limit - 1)
        .order("createdAt", { ascending: asc })
        .ilike("product.nameproduct", `%${nameProduct}%`)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getReservationByProductId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM reservation WHERE "productId"='${id}'`,

        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateReservation: (reservationId, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE reservation SET location=$1, "startDate"=$2, "returnDate"=$3, quantity=$4, "productId"=$5, "updatedAt"=$6 WHERE "reservationId" = '${reservationId}'`,
        [
          data.location,
          data.startDate,
          data.returnDate,
          data.quantity,
          data.productId,
          data.updatedAt,
        ],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  deleteReservation: (reservationId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM reservation WHERE "reservationId"= $1`,
        [reservationId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
};
