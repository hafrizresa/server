const { role } = require('../../models');

const GetRole = async (payload) => {
    try {
        const result = await role.findOne({
            where: {
                data: {
                    role_name: payload
                }
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    GetRole,
}