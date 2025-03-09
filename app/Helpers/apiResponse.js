function apiResponse(res, code = 200, message = null, errors = null, data = null) {
    const response = {
        status: code,
        success: code >= 200 && code < 300,
        message: message,
    };

    if (data === null && errors !== null) {
        response.errors = errors;
    } else if (data !== null && errors === null) {
        response.data = data;
    } else {
        response.data = data;
        response.errors = errors;
    }

    return res.status(code).json(response);
}

module.exports = apiResponse;