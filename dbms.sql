create database bank;
use bank;
create table bank_location(
bank_loc varchar(50) unique,
bank_ifsc varchar(12) primary key
);

create table bank_employee( 
bank_emp_fname varchar(30) not null,
bank_emp_lname varchar(30) not null,
bank_emp_phone text not null,
bank_emp_emailid varchar(50),
bank_emp_id int(10) primary key,
bank_emp_address text not null,
bank_emp_password varchar(20) not null,
bank_emp_aadhar varchar(12) not null,
bank_emp_branch_loc varchar(50), 
bank_emp_branch_ifsc varchar(12),
foreign key(bank_emp_branch_loc) references bank_location(bank_loc) on update cascade on delete cascade,
foreign key(bank_emp_branch_ifsc) references bank_location(bank_ifsc) on delete cascade on update cascade
);

CREATE TABLE bank_customer (
    bank_cust_fname VARCHAR(30) NOT NULL,
    bank_cust_lname VARCHAR(30) NOT NULL,
    bank_cust_phone BIGINT NOT NULL,
    bank_cust_emailid VARCHAR(50),
    bank_cust_account_id INT(10) PRIMARY KEY,
    bank_cust_address VARCHAR(50) NOT NULL,
    bank_cust_aadhar VARCHAR(12) NOT NULL,
    bank_cust_branch_loc VARCHAR(50),
    bank_cust_branch_ifsc VARCHAR(12),
    bank_cust_balance bigint DEFAULT 0,
    bank_cust_password VARCHAR(20) NOT NULL,
    bank_cust_photo LONGBLOB,
    FOREIGN KEY (bank_cust_branch_loc) REFERENCES bank_location(bank_loc) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (bank_cust_branch_ifsc) REFERENCES bank_location(bank_ifsc) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE bank_balance(
	amt bigint not null default 0,
    cust_accId int(10) primary key,
    foreign key(cust_accId) references bank_customer(bank_cust_account_id) on delete cascade on update cascade
);
create table transaction
(
	transaction_id int auto_increment primary key,
	amt bigint default 0,
	debitcustomerId int(10),
	creditcustomerId int(10),
	time time,
	date date,
	creditCurBalance bigint,
    debitCurBalance bigint,
	FOREIGN KEY (debitcustomerId) REFERENCES bank_customer(bank_cust_account_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (creditcustomerId) REFERENCES bank_customer(bank_cust_account_id) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO bank_location (bank_loc, bank_ifsc) VALUES
('New York Branch', 'ABCD1234567'),
('San Francisco Branch', 'EFGH8901234');

INSERT INTO bank_employee (
    bank_emp_fname, bank_emp_lname, bank_emp_phone, bank_emp_emailid,
    bank_emp_id, bank_emp_address, bank_emp_password, bank_emp_aadhar,
    bank_emp_branch_loc, bank_emp_branch_ifsc
) VALUES
('John', 'Doe', 1234567890, 'john.doe@example.com', 1, '123 Main St', 'password123', '123456789012', 'New York Branch', 'ABCD1234567'),
('Jane', 'Smith', 9876543210, 'jane.smith@example.com', 2, '456 Elm St', 'password456', '987654321012', 'San Francisco Branch', 'EFGH8901234');

INSERT INTO bank_customer (
    bank_cust_fname, bank_cust_lname, bank_cust_phone,
    bank_cust_emailid, bank_cust_account_id, bank_cust_address,
    bank_cust_aadhar, bank_cust_branch_loc, bank_cust_branch_ifsc, bank_cust_password
) VALUES
('John', 'Doe', 1234567890, 'john.doe@example.com', 1, '123 Main St',
 '123456789012', 'New York Branch', 'ABCD1234567',  'password123'),
('Jane', 'Smith',  9876543210, 'jane.smith@example.com', 2, '456 Elm St',
 '987654321012', 'San Francisco Branch', 'EFGH8901234',  'password456'),
('Michael', 'Johnson',  5551112222, 'michael.johnson@example.com', 3, '789 Oak St',
 '555111222233', 'New York Branch', 'ABCD1234567',  'password789'),
('Emily', 'Williams',  3334445555, 'emily.williams@example.com', 4, '101 Pine St',
 '333444555566', 'San Francisco Branch', 'EFGH8901234',   'password101'),
('Daniel', 'Brown',  7778889999, 'daniel.brown@example.com', 5, '222 Maple St',
 '777888999911', 'New York Branch', 'ABCD1234567',   'password222'),
('Sophia', 'Jones',  9998887777, 'sophia.jones@example.com', 6, '333 Birch St',
 '999888777744', 'San Francisco Branch', 'EFGH8901234',   'password333'),
('William', 'Miller',  6665554444, 'william.miller@example.com', 7, '444 Cedar St',
 '666555444455', 'New York Branch', 'ABCD1234567',   'password444'),
('Olivia', 'Davis',  2223334444, 'olivia.davis@example.com', 8, '555 Walnut St',
 '222333444466', 'San Francisco Branch', 'EFGH8901234',   'password555'),
('Liam', 'Garcia',  8889990000, 'liam.garcia@example.com', 9, '666 Oak St',
 '888999000011', 'New York Branch', 'ABCD1234567',   'password666'),
('Ava', 'Rodriguez',  4445556666, 'ava.rodriguez@example.com', 10, '777 Maple St',
 '444555666677', 'San Francisco Branch', 'EFGH8901234',   'password777');
 
INSERT INTO bank_balance (cust_accId) VALUES
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

-- below line is for setting the bank_photo to null
-- update bank_customer set bank_cust_photo = NULL;
-- truncate credit;
-- truncate debit;
-- truncate time;
-- truncate date;