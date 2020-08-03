const sequelize = require('sequelize');
const { user, role } = require('../../models');
const { hashPassword } = require('../../helpers/common');
const { v4: uuidv4 } = require('uuid');
const GetUser = async (query) => {
    try {
        const result = await user.findOne({
            where: {
                ...query,
                deleted_at: null
            },
            attributes: ['data', 'id'],
            include: [
                {
                    model: role,
                    attributes: ['data'],
                }
            ]
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const CreateUser = async (payload) => {
    try {
        const validate = await user.findOne({
            where: {
                data: {
                    email: payload.email
                }
            },
            attributes: ['data']
        });
        if (validate) {
            throw { message: 'email already taken' };
        }
        const hash = hashPassword(payload.password);
        const { role_id, role, ...rest } = payload;
        const userOptions = {
            id: uuidv4(),
            data: {
                ...rest,
                password: hash,
                status: {
                    is_active: true
                }
            },
            role_id
        }
        const userCreate = await user.create(userOptions);
        return userCreate;
    } catch (error) {
        throw error;
    }
};

const DeleteUser = async (userId) => {
    try {
        await user.update({
            deleted_at: new Date()
        }, {
            where: {
                id: userId
            }
        })
        return true
    } catch (error) {
        throw error;
    }
};

const GetAllUser = async (query) => {
    try {
        let offset = query.page ? (query.page - 1) * 5 : 0;
        const userData = await user.findAll({
            where: {
                deleted_at: null,
            },
            attributes: [
                [sequelize.json('data.username'), 'Username'],
                [sequelize.json('data.email'), 'Email'],
                [sequelize.json('data.status'), "Status"]
            ],
            limit: 5,
            offset
        });
        userData.forEach(element => {
            if (element.dataValues.Status) {
                element.dataValues.Status = JSON.parse(element.dataValues.Status)
            }
        });
        return userData;
    } catch (error) {
        throw error
    }
};

const GetDetailUser = async (userId) => {
    try {
        let users;
        let result = await user.findOne({
            where: {
                id: userId
            },
            attributes: [
                ['id', 'User id'],
                'data'
            ],
            include: [
                {
                    model: role,
                    attributes: [
                        [sequelize.json('data.role_name'), 'Role Name'],
                    ],
                }
            ]
        });
        if (result) {
            delete result.data.password;
            delete result.data.status;
            users = {
                "User id": result.dataValues["User id"],
                ...result.data,
                ...result.role.dataValues
            }
        }
        return users;
    } catch (error) {
        throw error
    }
}

const UpdateUser = async (data, userId, roleId) => {
    try {
        const userData = await user.findOne({
            where: {
                id: userId
            },
            attributes: ['id', 'data', 'role_id']
        });
        if (data.password) {
            const hash = hashPassword(data.password);
            data.password = hash;
        }
        userData.data = {
            ...userData.data,
            ...data
        }
        if (roleId) {
            userData.role_id = roleId;
        }
        await userData.save();
        return userData;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    GetUser,
    CreateUser,
    DeleteUser,
    UpdateUser,
    GetAllUser,
    GetDetailUser
};
