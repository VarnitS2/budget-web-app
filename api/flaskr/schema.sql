DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merchant TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    amount DECIMAL(5,2) NOT NULL,
    transaction_date DATE NOT NULL
);