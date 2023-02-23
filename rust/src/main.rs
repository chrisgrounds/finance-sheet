extern crate google_sheets4 as sheets4;
use sheets4::{hyper, hyper_rustls, oauth2, Sheets};
use std::collections::HashMap;

#[tokio::main]
async fn main() {
    let secret: oauth2::ServiceAccountKey = oauth2::read_service_account_key("priv_key.json")
        .await
        .expect("secret no");

    let client = hyper::Client::builder().build(
        hyper_rustls::HttpsConnectorBuilder::new()
            .with_native_roots()
            .https_only()
            .enable_http1()
            .enable_http2()
            .build(),
    );

    let auth = oauth2::ServiceAccountAuthenticator::with_client(secret, client.clone())
        .build()
        .await
        .expect("could not create an authenticator");

    let mut hub = Sheets::new(client, auth);

    let result = hub
        .spreadsheets()
        .values_get(
            "1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4",
            "Deposits Stream!A2:B",
        )
        .doit()
        .await;

    match result {
        Err(e) => println!("{}", e),
        Ok((_, spreadsheet)) => {
            let totals = HashMap::<String, i32>::new();

            println!(
                "Success: {:?}",
                spreadsheet
                    .values
                    .unwrap()
                    .into_iter()
                    .fold(totals, |mut acc, next_row| {
                        let key: String = next_row[0].clone();
                        let current_value: Option<&i32> = acc.get(&key);
                        let next_value: i32 = next_row[1].parse::<i32>().unwrap();

                        let new_value: i32 = match current_value {
                            None => next_value + 0,
                            Some(x) => next_value + x,
                        };

                        acc.insert(key, new_value);

                        return acc;
                    })
            );
        }
    }
}
