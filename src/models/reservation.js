const connection = require("../config/postgresql");

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
  getAllReservation: (limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM Reservation LIMIT $1 OFFSET $2",
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
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
  getReservationByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM reservation WHERE "userId"='${id}'`,

        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
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
