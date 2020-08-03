const { httpStatus, responseCode } = require('../configs/codes');
const { ValidateToken } = require('../middlewares/auth');
const { CreateUser, DeleteUser, UpdateUser, GetAllUser, GetDetailUser } = require('../libs/query/user');
const { GetRole } = require('../libs/query/role');

class UserController {
    static async CreateUser(req, res) {
        try {
            req.checkBody({
                email: { notEmpty: true, errorMessage: 'email field is required' },
                username: { notEmpty: true, errorMessage: 'username field is required' },
                password: { notEmpty: true, errorMessage: 'password field is required' },
                role: { notEmpty: true, errorMessage: 'role field is required' },
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.status(httpStatus.forbidden).json({
                    success: false,
                    msg: errors,
                    rc: responseCode.missingParameter,
                });
            }
            const role = await GetRole(req.body.role);
            if (!role) {
                return res.status(httpStatus.badRequest).json({
                    rc: responseCode.roleNotFound,
                    message: 'role not found'
                })
            }
            const user = await CreateUser({
                ...req.body,
                role_id: role.id
            })
            return res.status(httpStatus.created).json({
                rc: responseCode.success,
                data: user
            })
        } catch (error) {
            return res.status(httpStatus.internalServerError).json({
                rc: responseCode.generalError,
                message: error.message
            })
        }
    }

    static async DeleteUser(req, res) {
        try {
            req.checkParams({
                user_id: { notEmpty: true, errorMessage: 'user_id field is required' },
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.status(httpStatus.forbidden).json({
                    success: false,
                    msg: errors,
                    rc: responseCode.missingParameter,
                });
            }
            await DeleteUser(req.params.user_id)
            return res.status(httpStatus.ok).json({
                rc: responseCode.success,
                message: 'success delete user'
            })
        } catch (error) {
            return res.status(httpStatus.internalServerError).json({
                rc: responseCode.generalError,
                message: error.message
            })
        }
    }

    static async UpdateUser(req, res) {
        try {
            req.checkParams({
                user_id: { notEmpty: true, errorMessage: 'user_id field is required' },
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.status(httpStatus.forbidden).json({
                    success: false,
                    msg: errors,
                    rc: responseCode.missingParameter,
                });
            }
            const { role, ...rest } = req.body;
            let roleId;
            if (role) {
                const role = await GetRole(req.body.role);
                if (!role) {
                    return res.status(httpStatus.badRequest).json({
                        rc: responseCode.roleNotFound,
                        message: 'Role Not Found'
                    })
                }
                roleId = role.id;
            }
            const result = await UpdateUser(rest, req.params.user_id, roleId);
            return res.status(httpStatus.created).json({
                rc: responseCode.success,
                message: 'User Updated',
                data: result
            });
        } catch (error) {
            return res.status(httpStatus.internalServerError).json({
                rc: responseCode.generalError,
                message: error.message
            })
        }
    }

    static async GetUser(req, res) {
        try {
            let result;
            if (req.query.user_id) {
                result = await GetDetailUser(req.query.user_id);
            } else {
                result = await GetAllUser(req.query);
            }
            return res.status(httpStatus.ok).json({
                rc: responseCode.success,
                data: result
            })
        } catch (error) {
            return res.status(httpStatus.internalServerError).json({
                rc: responseCode.generalError,
                message: error.message
            })
        }
    }

};

module.exports = (router) => {
    router.post('/create', ValidateToken, UserController.CreateUser);
    router.put('/edit/:user_id', ValidateToken, UserController.UpdateUser);
    router.delete('/delete/:user_id', ValidateToken, UserController.DeleteUser);
    router.get('/', UserController.GetUser);
};
