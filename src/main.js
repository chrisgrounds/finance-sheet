import { google } from 'googleapis';
import privKey from '../priv_key.json' assert { type: 'json' };
import { Log } from "./Log";

const rowMap = {
  "Options": (acc, next) => ({ ...acc, optionsDeposits: acc.optionsDeposits + parseInt(next[1]) }),
  "ISA": (acc, next) => ({ ...acc, isaDeposits: acc.isaDeposits + parseInt(next[1]) }),
};

const auth = async () => {
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

const main = async () => {
  const jwtClient = await auth();

  const sheets = google.sheets({ version: 'v4', auth: jwtClient });

  const { data: { values: rows } } = await sheets
    .spreadsheets
    .values
    .get({
      spreadsheetId: '1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4',
      range: 'Deposits Stream!A2:B',
    });

  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }

  const summedRows = rows.reduce((acc, next) => {
    const rowEntry = rowMap[next[0]];

    return rowEntry ? rowEntry(acc, next) : acc;
  }, { "optionsDeposits": 0, "isaDeposits": 0 });

  Log.info(summedRows);

  const dataToWrite = {
    values: [
      [
        "Total Options Deposits",
        "Total ISA Deposits"
      ],
      [
        summedRows.optionsDeposits,
        summedRows.isaDeposits
      ]
    ]
  }

  sheets
    .spreadsheets
    .values
    .append({
      spreadsheetId: '1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4',
      range: 'Deposits Stream!G1',
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

main();
