CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mail_id TEXT NOT NULL,
  username CHAR(60) NOT NULL,
  user_password CHAR(60) NOT NULL,
  is_2fa_enabled BOOLEAN DEFAULT false
);