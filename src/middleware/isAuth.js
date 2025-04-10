const jwt = require("jsonwebtoken")
const express = require('express');
const auth = require("../controllers/users/AuthController");

function isAuth(req, res, next) {
    console.log("O middleware foi chamado")

    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).end()
    }

    const [, token] = authToken.split(" ")

    try {
        const { subject } = jwt.verify(token, process.env.SECRET_KEY, )
        req.user_id = subject
        return next()
    } catch (error) {
        return res.status(401).end()
    }
}

module.exports = isAuth;