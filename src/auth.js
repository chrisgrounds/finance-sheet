import {google} from "googleapis";

export const auth = async (privKey) => {
    const jwtClient = new google.auth.JWT(
        privKey.client_email,
        null,
        privKey.private_key,
        [
            "https://www.googleapis.com/auth/spreadsheets",
        ]
    );

    return new Promise((resolve, reject) => {
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Success authenticating...")
                resolve(jwtClient);
            }
        });
    });
}