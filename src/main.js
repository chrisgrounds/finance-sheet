import privKey from '../priv_key.json' assert {type: 'json'};
import {loadSheets} from "./sheets.js";

const mainParams = {
    privKey: privKey,
    sheetId: '1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4',
    depositRangeInput: 'Deposits Stream!A2:B',
    depositRangeOutput: 'Deposits Stream!G1',
}

const main = async ({privKey, sheetId, depositRangeInput, depositRangeOutput}) => {
    const sheets = await loadSheets(privKey, sheetId);
    const rows = await sheets.loadRows(depositRangeInput);
    if (hasNoData(rows)) return;

    const deposits = sumDeposits(rows);

    await sheets.writeRows(depositRangeOutput, deposits);
}

function hasNoData(rows) {
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return true;
    }
    return false;
}

function sumDeposits(rows) {
    return rows.reduce((totals, row) => {
        let key = row[0];
        let value = isNaN(Number(row[1])) ? 0 : Number(row[1]);
        if (totals[key] === undefined) totals[key] = 0;
        totals[key] = totals[key] + value;
        return totals;
    }, {});
}

main(mainParams);
