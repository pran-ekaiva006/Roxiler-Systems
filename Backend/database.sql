
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role VARCHAR(20) NOT NULL DEFAULT 'normal_user' CHECK (role IN ('admin', 'normal_user', 'store_owner')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400) NOT NULL,
  owner_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, store_id)
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_email ON stores(email);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);