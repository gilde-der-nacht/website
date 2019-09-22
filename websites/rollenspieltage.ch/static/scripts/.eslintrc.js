module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2019,
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-unused-vars": ["off"],
        "no-console": ["off"],
    }
};
