const { VerifyToken } = require('../helpers/common');
const { httpStatus, responseCode } = require('../configs/codes');
const { GetUser } = require('../libs/query/user');

const ValidateToken = async (req, res, next) => {
    try {
        req.checkHeaders({
            token: { notEmpty: true, errorMessage: 'token field is required' },
        });
        const errors = req.validationErrors();
        if (errors) {
            return res.status(httpStatus.forbidden).json({
                success: false,
                msg: errors,
                rc: responseCode.missingParameter,
            });
        }
        const validate = VerifyToken(req.headers.token);
        const user = await GetUser({ id: validate.id })
        if (user.role.data.role_name !== 'Admin') {
            return res.status(httpStatus.unauthorized).json({
                rc: responseCode.userNotAuthorized,
                message: 'User Not Authorized'
            })
        }
        return next()
    } catch (error) {
        return res.status(httpStatus.internalServerError).json({
            rc: responseCode.generalError,
            message: error.message
        })
    }
};

module.exports = {
    ValidateToken,
};
