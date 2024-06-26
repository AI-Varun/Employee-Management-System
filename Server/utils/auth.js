const User = require("../models/user");
const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(
            token,
            "Raj secret key",
            async (err, decodedToken) => {
                if (err) {
                    res.json({ status: false });
                    next();
                } else {
                    const user = await User.findById(decodedToken.id);
                    if (user) res.json({ status: true, user: user.email });
                    else res.json({ status: false });
                    next();
                }
            }
        );
    } else {
        res.json({ status: false });
        next();
    }
};

module.exports = checkUser;