const snapMidtrans = require("../config/midtrans");

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
      console.log(data.reservationId);
      console.log(data.amount);
      const parameter = {
        transaction_details: {
          order_id: data.reservationId,
          gross_amount: data.amount,
        },
        credit_card: {
          secure: true,
        },
      };

      snapMidtrans
        .createTransaction(parameter)
        .then((transaction) => {
          // transaction redirect_url
          const redirectUrl = transaction.redirect_url;
          console.log("redirectUrl:", redirectUrl);
          resolve(transaction);
        })
        .catch((e) => reject(e));
    }),
  notif: (data) =>
    new Promise((resolve, reject) => {
      snapMidtrans.transaction
        .notification(data)
        .then((result) => resolve(result))
        .catch((e) => reject(e));
    }),
};
