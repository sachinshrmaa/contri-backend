
-- users table
CREATE TABLE Users (
    user_id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'FREE', 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- groups table
CREATE TABLE Groups (
    group_id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'trip',
    created_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- uses groups mapping table
CREATE TABLE UsersGroupsMapping (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id)
);