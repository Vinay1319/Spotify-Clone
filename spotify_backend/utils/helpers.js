const jwt = require("jsonwebtoken");

exports.getToken = async (email, user) => {
    const token = jwt.sign(
        { identifier: user._id },
        "secretKey"
    );
    return token;
};
