USE catchupdb;

# Test server input
INSERT INTO servers (server_id, server_login) 
VALUES ("1234567891011121314", "This is my server login!");

# Test quotes input
INSERT INTO quotes (server_id, quote, author, date_quoted)
VALUES ("1234567891011121314", "Don't you dare start crying!", "Frank Canovatchel", "2024-12-14");
INSERT INTO quotes (server_id, quote, author, date_quoted)
VALUES ("1234567891011121314", "I like cheese", "John Groton", "2024-12-14");
INSERT INTO quotes (server_id, quote, author, date_quoted)
VALUES ("1234567891011121314", "I like movies", "Mason Lee", "2024-12-14");

# Test query
SELECT * FROM quotes
JOIN servers ON servers.server_id = quotes.server_id;