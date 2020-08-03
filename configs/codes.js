module.exports = {
    httpStatus: {
        ok: 200,
        created: 201,
        badRequest: 400,
        notFound: 404,
        unauthorized: 401,
        forbidden: 403,
        internalServerError: 500,
        VANotActive: 455,
    },
    responseCode: {
        success: 0,
        invalidToken: 10,
        pinNotMatch: 41,
        userNotFound: 21,
        duplicateUser: 24,
        missingParameter: 31,
        userNotAuthorized: 32,
        roleNotFound: 33,
        generalError: 66
    },
};
