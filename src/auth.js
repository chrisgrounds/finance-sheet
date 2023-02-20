import { google } from "googleapis";
import { Log } from "./Log.js";

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
                Log.error(err);
                reject(err);
            } else {
                Log.info("Success authenticating...")
                resolve(jwtClient);
            }
        });
    });
}