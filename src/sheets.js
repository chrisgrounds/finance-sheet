import { google } from "googleapis";
import { auth } from "./auth.js";
import { Log } from "./Log.js";

export async function loadSheets(privKey, sheetId) {
  const jwtClient = await auth(privKey);
  const sheets = await google.sheets({ version: 'v4', auth: jwtClient });

  return {
    loadRows: async (depositRangeInput) => {
      const { data: { values: rows } } = await sheets
        .spreadsheets
        .values
        .get({
          spreadsheetId: sheetId,
          range: depositRangeInput,
        });

      return rows;
    },
    writeRows: async (depositRangeOutput, deposits) => {
      const dataToWrite = {
        values: [
          Object.keys(deposits).map(type => `Total ${type} Deposits`),
          Object.values(deposits),
        ]
      }
      await sheets
        .spreadsheets
        .values
        .update({
          spreadsheetId: sheetId,
          range: depositRangeOutput,
          resource: dataToWrite,
          valueInputOption: "RAW",
        }, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            Log.info(
              `${result.data.updatedCells} cells updated on range: ${result.data.updatedRange}`
            );
          }
        });
    }
  }
}