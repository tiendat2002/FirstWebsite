import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exists
                let user = await db.User.findOne({
                    where: { email: email },
                });
                if (user) {
                    //compare the password
                    let checkPassword = bcrypt.compareSync(
                        password,
                        user.password
                    );
                    // console.log(checkPassword);
                    if (checkPassword) {
                        userData.errCode = 0;
                        userData.errMessage = "Ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "not correct for password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User isn't exist";
                }
                resolve(userData);
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage =
                    "Your's email isn't exist in My system. please try other email";
                resolve(userData);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = async (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(data.email);
            if (isExist) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Your email is already in used! please try another email",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(
                    data.password
                );
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                });
                resolve({ errCode: 0, errMessage: "Ok" });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: id } });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "The user isn't exists",
                });
            } else {
                await db.User.destroy({
                    where: { id: id },
                });
                resolve({
                    errCode: 0,
                    errMessage: "The user has been deleted",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: "Updated the user success!",
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "The user is't exist",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
};
