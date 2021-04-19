const mongoose = require("mongoose");

const url =
process.env.MONGODB_URI||"mongodb+srv://lantaocui:adminadmin@cluster0-pkcwo.mongodb.net/CSC309?retryWrites=true&w=majority";

function connect() {
    mongoose.set("debug", true);

    return mongoose
        .connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(msg => {
            console.log(
                " \n\n-----------------\nsuccessfully connected to Database\n-----------------\n\n"
            );
        }) 
        .catch(error => console.log(error));
    //   return mongoose.connect(
    //     url,
    //     {
    //       auth: {
    //         user: "trtest1tor",
    //         password:
    //           "XeNetQxjzUPT8ine4z0VNCjD6R5S4WJwii8cXuRJ0z7aBqbd46An3Ndf7FX8Js1x9tAyihpL5X8tFbtpy18qHw=="
    //       }
    //     },
    //     function(err, db) {
    //       if (!err) {
    //         console.log("Successfully connected to database");
    //       }
    //     }
    //   );
}

module.exports = {
    connect,
    mongoose
};