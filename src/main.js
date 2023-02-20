import privKey from '../priv_key.json' assert {type: 'json'};
import {loadSheets} from "./sheets.js";

const mainParams = {
    privKey: privKey,
    sheetId: '1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4',
    depositRangeInput: 'Deposits Stream!A2:B',
    depositRangeOutput: 'Deposits Stream!G1',
    depositData: {
        "Options": "Total Options Deposits",
        "ISA": "Total ISA Deposits",
    }
}

const main = async ({privKey, sheetId, depositRangeInput, depositRangeOutput, depositData}) => {
    const sheets = await loadSheets(privKey, sheetId);
    const rows = await sheets.loadRows(depositRangeInput);
    if (hasNoData(rows)) return;

    const deposits = sumDeposits(rows, depositData);

    await sheets.writeRows(depositRangeOutput, depositData, deposits);
}

function hasNoData(rows) {
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return true;
    }
    return false;
}

function sumDeposits(rows, depositData) {
    return rows.reduce((totals, row) => {
        let key = row[0];
        let value = row[1];
        if (depositData[key]) {
            if (totals[key] === undefined) totals[key] = 0;
            totals[key] = totals[key] + value;
        }
        return totals;
    }, {});

    // const summedRows = rows.reduce((acc, next) => {
    //     const rowEntry = {
    //         "Options": (acc, next) => ({...acc, optionsDeposits: acc.optionsDeposits + parseInt(next[1])}),
    //         "ISA": (acc, next) => ({...acc, isaDeposits: acc.isaDeposits + parseInt(next[1])}),
    //     }[next[0]];
    //
    //     return rowEntry ? rowEntry(acc, next) : acc;
    // }, {"optionsDeposits": 0, "isaDeposits": 0});
    //
    // console.log(summedRows);
    // return summedRows;
}

main(mainParams);
