import {google} from 'googleapis';
import {auth} from "./auth.js";
import privKey from '../priv_key.json' assert {type: 'json'};

const rowMap = {
    "Options": (acc, next) => ({...acc, optionsDeposits: acc.optionsDeposits + parseInt(next[1])}),
    "ISA": (acc, next) => ({...acc, isaDeposits: acc.isaDeposits + parseInt(next[1])}),
};

const mainParams = {
    privKey: privKey,
    sheetId: '1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4',
    depositRangeInput: 'Deposits Stream!A2:B',
    depositRangeOutput: 'Deposits Stream!G1',
}

const main = async ({privKey, sheetId, depositRangeInput, depositRangeOutput}) => {
    const sheets = await loadSheets(privKey);
    const rows = await loadRows(sheets, sheetId, depositRangeInput);

    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return;
    }
    const {isaDeposits, optionsDeposits} = sumDeposits(rows);

    const dataToWrite = {
        values: [
            ["Total Options Deposits", "Total ISA Deposits"],
            [optionsDeposits, isaDeposits]
        ]
    }
    writeRows(sheets, sheetId, depositRangeOutput, dataToWrite);
}

async function loadSheets(privKey) {
    const jwtClient = await auth(privKey);
    return google.sheets({version: 'v4', auth: jwtClient});
}

function sumDeposits(rows) {
    const summedRows = rows.reduce((acc, next) => {
        const rowEntry = rowMap[next[0]];

        return rowEntry ? rowEntry(acc, next) : acc;
    }, {"optionsDeposits": 0, "isaDeposits": 0});

    console.log(summedRows);
    return summedRows;
}

async function loadRows(sheets, sheetId, depositRangeInput) {
    const {data: {values: rows}} = await sheets
        .spreadsheets
        .values
        .get({
            spreadsheetId: sheetId,
            range: depositRangeInput,
        });
    return rows;
}

function writeRows(sheets, sheetId, depositRangeOutput, dataToWrite) {
    sheets
        .spreadsheets
        .values
        .append({
            spreadsheetId: sheetId,
            range: depositRangeOutput,
            resource: dataToWrite,
            valueInputOption: "RAW",
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    '%d cells updated on range: %s',
                    result.data.updates.updatedCells,
                    result.data.updates.updatedRange
                );
            }
        });
}

main(mainParams);
