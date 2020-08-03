const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');

const CreateToken = (payload) => {
    try {
        const result = jwt.sign(payload, config.get('SECRET'));
        return result;
    } catch (error) {
        throw error;
    }
};

const VerifyToken = (token) => {
    try {
        const result = jwt.verify(token, config.get('SECRET'));
        return result;
    } catch (error) {
        throw error;
    }
}

const hashPassword = (password) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    CreateToken,
    VerifyToken,
    hashPassword
};
