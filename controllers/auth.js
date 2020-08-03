const { httpStatus, responseCode } = require('../configs/codes');
const { GetUser } = require('../libs/query/user');
const { CreateToken } = require('../helpers/common');

class AuthController {
    static async Login(req, res) {
        try {
            req.checkBody({
                email: { notEmpty: true, errorMessage: 'email field is required' },
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.status(httpStatus.forbidden).json({
                    success: false,
                    msg: errors,
                    rc: responseCode.missingParameter,
                });
            }
            const user = await GetUser({ data: { email: req.body.email, status: { is_active: true } } });
            // Because I dont know what is your composition to hash the password in current DB, so i just find if there any user or not
            // Usually I also check the password
            if (!user) {
                return res.status(httpStatus.badRequest).json({
                    rc: responseCode.userNotFound,
                    message: 'User Not Found'
                });
            }
            delete user.data.password;
            const token = CreateToken(user.dataValues);
            return res.status(httpStatus.ok).json({
                rc: responseCode.success,
                token
            });
        } catch (error) {
            return res.status(httpStatus.internalServerError).json({
                rc: responseCode.generalError,
                message: error.message
            })
        }
    }
};

module.exports = (router) => {
    router.post('/', AuthController.Login);
};
