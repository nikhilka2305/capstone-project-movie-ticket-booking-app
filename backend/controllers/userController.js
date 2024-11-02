const express = require("express");

const viewUsers = (req, res, next) => {
	res.send("User Controller in Action");
};

const addUsers = (req, res, next) => {
	res.send("User Controller in Action for Add");
};

exports.viewUsers = viewUsers;
exports.addUsers = addUsers;
