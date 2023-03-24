DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS financial_profiles;
DROP TABLE IF EXISTS aspirations;
CREATE TABLE user_profiles
(
    id       BIGINT PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    age      INT          NOT NULL
);

CREATE TABLE financial_profiles
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_profile_id BIGINT           NOT NULL,
    annual_salary   DOUBLE PRECISION NOT NULL,
    current_assets  DOUBLE PRECISION NOT NULL,
    liabilities     DOUBLE PRECISION NOT NULL,
    risk_tolerance  VARCHAR(255)     NOT NULL,
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles (id)
);

CREATE TABLE aspirations
(
    id                         BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_profile_id            BIGINT NOT NULL,
    vacation_bucket_list       TEXT,
    hobbies                      TEXT,
    anticipated_retirement_age INT    NOT NULL,
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles (id)
);