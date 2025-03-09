const apiResponse = require('../../Helpers/apiResponse');

class BaseController {
    constructor() {
        this.apiResponse = apiResponse; // Assign the apiResponse function to `this`
    }
}

module.exports = BaseController;