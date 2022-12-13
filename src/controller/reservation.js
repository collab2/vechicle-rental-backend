const wrapper = require("../utils/wrapper");
const reservationModel = require("../models/reservation");
const snapMidtrnas = require("../utils/snapMidtrnas");

module.exports = {
  createReservation: async (request, response) => {
    try {
      const {
        location,
        startDate,
        returnDate,
        paymentMethod,
        quantity,
        statusPayment,
        userId,
        amount,
        productId,
      } = request.body;

      const today = new Date().toLocaleDateString();
      const setData = {
        location,
        startDate,
        returnDate,
        paymentMethod,
        reservationDate: today,
        quantity,
        statusPayment,
        userId,
        productId,
        amount,
      };

      await reservationModel.createReservation(setData);
      const reservationData = await reservationModel.getLastReservation();
      // console.log(reservationData.rows[0].reservationId);
      // console.log(typof );
      const redirectUrl = await snapMidtrnas.post({
        reservationId: reservationData.rows[0].reservationId,
        amount,
      });
      console.log(reservationData.rows);

      return wrapper.response(response, 200, "Success Create Reservation", {
        redirectUrl,
        amount,
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getAllReservation: async (request, response) => {
    try {
      let { page, limit, date, name, category } = request.query;
      page = +page || 1;

      limit = +limit || totalData;
      const resultTotalData = await reservationModel.getCountReservation();
      const totalPage = Math.ceil(resultTotalData.rows / limit);
      const totalData = resultTotalData.rows[0].count;
      const pagination = {
        // page, totalPage, limit, totalData
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      const result = await reservationModel.getAllReservation(
        limit,
        offset,
        date,
        name,
        category
      );

      return wrapper.response(
        response,
        200,
        "Success Get All Reservation",
        result.rows,
        pagination
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getReservationById: async (request, response) => {
    try {
      const { reservationId } = request.params;

      const result = await reservationModel.getReservationById(reservationId);

      if (result.rowCount === 0) {
        return wrapper.response(
          response,
          200,
          `Reservation by ${reservationId} not found`,
          result.rows
        );
      }
      // console.log(result.rows.slice(6, 7));
      return wrapper.response(
        response,
        200,
        "Success Get Reservation",
        result.rows
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getReservationByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      console.log(userId);

      const data = request.query;

      // eslint-disable-next-line no-restricted-syntax
      for (const property in data) {
        if (data[property] === "") {
          data[property] = undefined;
        }
      }

      console.log(data);

      // eslint-disable-next-line prefer-const
      let { page, limit, asc, nameProduct } = data;

      if (asc !== undefined) {
        if (asc === "true") {
          asc = true;
        } else {
          asc = false;
        }
      }

      if (page === undefined) {
        page = 1;
      }

      if (limit === undefined) {
        limit = 4;
      }

      page = +page;

      const totalData = await reservationModel.getCountAllReservationName(
        userId,
        nameProduct
      );
      limit = totalData;
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const offset = page * limit - limit;

      const result = await reservationModel.getReservationByUserId(
        userId,
        nameProduct,
        offset,
        limit,
        asc
      );
      console.log(result);

      return wrapper.response(
        response,
        result.status,
        "Success Get Reservation By User Id",
        result.data,
        pagination
      );

      // if (result.rowCount === 0) {
      //   return wrapper.response(
      //     response,
      //     200,
      //     `Reservation not found`,
      //     result.rows
      //   );
      // }
      // // console.log(result.rows.slice(6, 7));
      // return wrapper.response(
      //   response,
      //   200,
      //   "Success Get Reservation",
      //   result.rows
      // );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getReservationByProductId: async (request, response) => {
    try {
      const { productId } = request.params;

      const result = await reservationModel.getReservationByProductId(
        productId
      );
      console.log(result);
      if (result.rowCount === 0) {
        return wrapper.response(
          response,
          200,
          `Reservation not found`,
          result.rows
        );
      }
      // console.log(result.rows.slice(6, 7));
      return wrapper.response(
        response,
        200,
        "Success Get Reservation",
        result.rows
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  updateReservation: async (request, response) => {
    try {
      const { reservationId } = request.params;

      // console.log(request.file);
      const { location, startDate, returnDate, quantity, productId } =
        request.body;

      const result = await reservationModel.getReservationById(reservationId);
      if (result.rowCount === 0) {
        return wrapper.response(
          response,
          200,
          `Reservation not found`,
          result.rows
        );
      }
      const today = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      const setData = {
        location,
        startDate,
        returnDate,
        quantity,
        productId,
        updatedAt: today,
      };

      await reservationModel.updateReservation(reservationId, setData);

      return wrapper.response(response, 200, "Success Update Data", setData);
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      // console.log(error);
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  deleteReservation: async (request, response) => {
    try {
      const { reservationId } = request.params;

      const checkId = await reservationModel.getCountReservationById(
        reservationId
      );
      console.log(checkId);
      //   if (checkId.rows[0].count !== 1) {
      //     return wrapper.response(
      //       response,
      //       404,
      //       `Data By Id ${productId} Not Found`,
      //       []
      //     );
      //   }
      await reservationModel.deleteReservation(reservationId);

      return wrapper.response(response, 200, "Success Delete Data", null);
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
