const { router } = require("../app")

module.exports = (router) => {
    router.get('/', (req,res) => {
        return res.status(200).send('PONG')
    });
};
