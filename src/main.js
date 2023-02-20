import { google } from 'googleapis';
import credentials from '../credentials.json' assert { type: 'json' };

async function main() {
  const sheets = google.sheets({ version: 'v4', auth: credentials.api_key });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4',
    range: 'Deposits Stream!A2:B',
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }

  const rowMap = {
    "Options": (acc, next) => ({ ...acc, optionsDeposits: acc.optionsDeposits + parseInt(next[1]) }),
    "ISA":     (acc, next) => ({ ...acc, isaDeposits: acc.optionsDeposits + parseInt(next[1]) }),
  };

  const summedRows = rows.reduce((acc, next) => {
    const rowEntry = rowMap[next];

    return rowEntry ? rowEntry(acc, next) : acc;
  }, { "optionsDeposits": 0, "isaDeposits": 0 });

  console.log(summedRows);
}

main();
