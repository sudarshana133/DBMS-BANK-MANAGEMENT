create database bank;
use bank;

create table bank_location(
bank_ifsc varchar(8) primary key not null,
bank_loc varchar(50) not null unique
);

create table bank_employee( 
bank_emp_id int(10) primary key,
bank_emp_fname varchar(30) not null,
bank_emp_lname varchar(30) not null,
bank_emp_mname varchar(30) ,
bank_emp_dob date not null,
bank_emp_phone int (10) not null,
bank_emp_emailid varchar(50),
bank_emp_address varchar(50) not null,
bank_emp_adhar varchar(12) not null,
bank_emp_salary int,
bank_emp_branch_loc varchar(50), 
bank_emp_branch_ifsc varchar(8),
foreign key(bank_emp_branch_loc) references bank_location(bank_loc) on update cascade on delete cascade,
foreign key(bank_emp_branch_ifsc) references bank_location(bank_ifsc) on delete cascade on update cascade
);
create table bank_customer(
	bank_custo_fname varchar(30) not null,
    bank_custo_lname varchar(30) not null,
    bank_custo_mname varchar(30) not null,
    bank_custo_phone int (10) not null,
    bank_custo_aadhar int (12) not null,
    custo_bank_ifsc varchar(8),
    foreign key(custo_bank_ifsc) references bank_location(bank_ifsc) on delete cascade on update cascade
);
INSERT INTO bank_location (bank_ifsc, bank_loc) VALUES
('IFSC001', 'New York Branch'),
('IFSC002', 'London Branch'),
('IFSC003', 'Tokyo Branch'),
('IFSC004', 'Sydney Branch');
ALTER TABLE bank_employee MODIFY bank_emp_phone VARCHAR(15) NOT NULL;
INSERT INTO bank_employee (bank_emp_id, bank_emp_fname, bank_emp_lname, bank_emp_mname, bank_emp_dob, bank_emp_phone, bank_emp_emailid, bank_emp_address, bank_emp_adhar, bank_emp_salary, bank_emp_branch_loc, bank_emp_branch_ifsc) VALUES
(1, 'John', 'Doe', NULL, '1990-08-15', 1234567890, 'john.doe@example.com', '123 Main St', '123456789012', 50000, 'New York Branch', 'IFSC001'),
(2, 'Jane', 'Smith', NULL, '1985-04-25', 9876543210, 'jane.smith@example.com', '456 Oak Ave', '987654321098', 55000, 'London Branch', 'IFSC002'),
(3, 'Bob', 'Johnson', 'Robert', '1995-12-10', 5678901234, 'bob.johnson@example.com', '789 Elm Rd', '567890123456', 48000, 'Tokyo Branch', 'IFSC003'),
(4, 'Alice', 'Brown', NULL, '1992-06-30', 8765432109, 'alice.brown@example.com', '321 Maple Ln', '876543210987', 52000, 'Sydney Branch', 'IFSC004');
ALTER TABLE bank_customer MODIFY bank_custo_phone VARCHAR(15) NOT NULL;
ALTER TABLE bank_customer MODIFY bank_custo_aadhar VARCHAR(20) NOT NULL;

INSERT INTO bank_customer (bank_custo_fname, bank_custo_lname, bank_custo_mname, bank_custo_phone, bank_custo_aadhar, custo_bank_ifsc) VALUES
('Michael', 'Johnson', 'M', '9876543210', '123456789012', 'IFSC001'),
('Emma', 'Smith', 'E', '8765432109', '987654321098', 'IFSC002'),
('Sophia', 'Brown', 'S', '5678901234', '567890123456', 'IFSC003'),
('William', 'Miller', 'W', '1234567890', '876543210987', 'IFSC004');

 select * from bank_location, 
