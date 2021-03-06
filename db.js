const Sequelize = require('sequelize');
let db;
if (process.env.DATABASE_URL) {
    db = new Sequelize(process.env.DATABASE_URL)
} else {
    db = new Sequelize(
        'chatbruhlogin',
        'userdb',
        'userdb',
        {
            dialect : 'mysql',
            host : 'localhost'
        }
    )
}



const Users = db.define('users',{
    username :{
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    firstName : {
        type : Sequelize.STRING,
        allowNull : false
    },
    lastName : {
        type :Sequelize.STRING,
        allowNull : false
    },
    
})

db.sync()

exports = module.exports = {
    db,
    Users
}
