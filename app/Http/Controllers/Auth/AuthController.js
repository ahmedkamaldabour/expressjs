const BaseController = require('../BaseController');
const catchAsync = require('../../../Helpers/catchAsync');
const User = require("../../../Models/UserModel");
const jwt = require('jsonwebtoken');
const AppError = require('../../../Helpers/AppError');
const {promisify} = require('util');


class AuthController extends BaseController {

    // constructor method
    constructor() {
        super()
        this.register = this.register.bind(this);
    }

    protected = catchAsync(async (req, res, next) => {
        // get token from request headers
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // check if token exists
        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }
        // verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }

        // check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        }

        // grant access to protected route
        req.user = currentUser;

        next();
    });

    // register a new user
    register = catchAsync(async (req, res, next) => {
        const request = req.body;
        const newUser = await User.create({
            name: request.name,
            email: request.email,
            password: request.password,
            passwordConfirm: request.passwordConfirm
        });

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '90d'
        });

        if (newUser) {
            return this.apiResponse(res, 201, 'User created successfully', null,
                {
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email
                    },
                    token: token
                }
            );
        }

    });

    // login a user
    login = catchAsync(async (req, res, next) => {
        const request = req.body;
        const {email, password} = request;

        // check if email and password are provided
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        // check if user exists and password is correct
        const user = await User.findOne({email}).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return this.apiResponse(res, 401, 'Incorrect email or password', null, null);
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '90d'
        });

        return this.apiResponse(res, 200, 'Login successful', null,
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token: token
            }
        );
    });
}



module.exports = new AuthController();