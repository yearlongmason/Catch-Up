USE catchupdb;

# Test quotes input
INSERT INTO app_quotes (quote_id, server_id, quote, author, date_quoted)
VALUES (1, "1291817041052827649", "Don't you dare start crying!", "Frank Canovatchel", "2024-12-8");
INSERT INTO app_quotes (quote_id, server_id, quote, author, date_quoted)
VALUES (2, "1291817041052827649", "I like cheese", "John Groton", "2024-12-14");
INSERT INTO app_quotes (quote_id, server_id, quote, author, date_quoted)
VALUES (3, "1291817041052827649", "Awagga!", "Mason Lee", "2024-12-14");
INSERT INTO app_quotes (quote_id, server_id, quote, author, date_quoted)
VALUES (4, "1291817041052827649", "Merry Christmas!", "Mason Lee", "2024-12-25");

# Test query
SELECT * FROM app_quotes;
#JOIN servers ON servers.server_id = quotes.server_id;

/*
Other Quotes:
Your model is terrible, your life stinks, go major in history or something
Would you be quiet? We’re talking about my awards, there should be silence throughout this whole campus
I’m sensing a high degree of happiness. Let me see if I can squash that
*/