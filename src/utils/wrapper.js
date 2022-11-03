module.exports = {
  response: (response, status, message, data, pagination) => {
    const result = {
      status,
      message,
      data, // data: data
      pagination, // pagination : pagination
    };
    return response.status(status).json(result);
  },
};
