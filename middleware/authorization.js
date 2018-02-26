'use stric'

const util = rootRequired('common/util');

const authorizationMiddleware = async (req, res, next) => {
    try {
        const rawToken = req.header('Authorization') || null;
        const tokenDetails = await util.validateToken(rawToken);
        req.tokenDetails = tokenDetails;
        next();
    } catch (e) {
        util.errorHandling(e, next);
    }
};

module.exports = authorizationMiddleware;