INSERT INTO user_profiles (name, location, age) VALUES ('John Doe', 'New York', 35);
INSERT INTO user_profiles (name, location, age) VALUES ('Jane Smith', 'Los Angeles', 28);

INSERT INTO financial_profiles (user_profile_id, annual_salary, current_assets, liabilities, risk_tolerance) VALUES (1, 85000, 120000, 40000, 'Moderate');
INSERT INTO financial_profiles (user_profile_id, annual_salary, current_assets, liabilities, risk_tolerance) VALUES (2, 95000, 150000, 55000, 'Low');

INSERT INTO aspirations (user_profile_id, vacation_bucket_list, hobbies, anticipated_retirement_age) VALUES (1, 'Visit Japan,Explore Australia,Cruise the Mediterranean', 'Company car,Flexible hours,Health insurance', 65);
INSERT INTO aspirations (user_profile_id, vacation_bucket_list, hobbies, anticipated_retirement_age) VALUES (2, 'Safari in Africa,Visit the Great Wall of China', 'Stock options,Remote work,Education reimbursement', 62);