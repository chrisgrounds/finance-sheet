pub struct Config {
    pub priv_key: String,
    pub sheet_id: String,
    pub deposit_range_input: String,
    pub deposit_range_output: String,
}

impl Config {
    pub fn new() -> Config {
        Config {
            priv_key: String::from("priv_key.json"),
            sheet_id: String::from("1VJI0G67jWe4KFeDyqrUpId1pX1-iK0A16maJ7I_pqP4"),
            deposit_range_input: String::from("Deposits Stream!A2:B"),
            deposit_range_output: String::from("Deposits Stream!G1"),
        }
    }
}
