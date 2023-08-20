const db=require("./connection");
const express=require("express");
const multer = require("multer");
const path = require("path");
const bodyParser=require("body-parser");
const cookieParser = require("cookie-parser");
const { log, error } = require("console");

const app=express();
// file upload
const storage = multer.diskStorage({
    destination:function(req,file,cb){
       return cb(null,"./public/images/profilePics");
    },
    filename: function(req,file,cb){
        // console.log(file);
        return cb(null,`${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({storage:storage});

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})
app.get("/customers",(req,res)=>
{
    var ifsc = req.cookies.ifsc;
    var sql= "SELECT * FROM bank_customer, bank_employee WHERE bank_emp_branch_ifsc=bank_cust_branch_ifsc AND bank_emp_branch_ifsc=?";
    db.query(sql,[ifsc],(err,result)=>{
        if(err) throw err;
        res.render("customer_table",{customers:result});
    })
})
app.get("/deleteCustomer",(req,res)=>{
    var id=req.query.id;
    var ifsc= req.query.ifsc;
    var sql= "Delete from bank_customer where bank_cust_account_id ='"+id+"'";
    db.query(sql,(err,result)=>{
        if(err) throw err;
        else 
        {
            res.redirect("/customers");
        }
    })
})

app.get("/updateCustomers",(req,res)=>{
    var id=req.query.id;
    var sql= "SELECT * FROM bank_customer where bank_cust_account_id = ?";
    db.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.render("update_details",{customers:result});
    })
})

app.get("/search",(req,res)=>{
    var accId=req.query.accId;
    const ifsc = req.cookies.ifsc;
    var sql = "SELECT * FROM bank_customer WHERE bank_cust_branch_ifsc=? AND bank_cust_account_id=?";
    db.query(sql,[ifsc,accId],(err,result)=>{
        if(err) throw err;
        res.render("customer_table",{customers:result});
    })
})
app.get("/profile", (req, res) => {
    const userId = req.cookies.custUserId;

    if (userId) {
        const sql = "SELECT * FROM bank_customer WHERE bank_cust_account_id = ?";
        db.query(sql, [userId], (err, result) => {
            if (err) throw err;

            // Render the profile page and pass the customer data and photo data
            res.render("customer_profile", { customer: result, userInfo: 0 });
        });
    } else {
        // Handle the case where neither userId nor custUserId is available
        // For example, you might redirect the user to a login page
        res.redirect("/customerLogin");
    }
});

app.get("/profile1",(req,res)=>{
    const id = req.query.id;
    res.cookie('custUserIdViewAdmin',id);
    var sql = "SELECT * FROM bank_customer where bank_cust_account_id=?";
    db.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.render("customer_profile",{customer:result,userInfo:1});
    })
})
// in point of view of admin only
app.get("/profileViewAdmin",(req,res)=>{
    const id = req.cookies.custUserIdViewAdmin;
    var sql = "SELECT * FROM bank_customer where bank_cust_account_id=?";
    db.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.render("customer_profile",{customer:result,userInfo:1});
    })
})
app.get("/transaction",(req,res)=>{
    const accId = req.query.id;
    res.render("transaction",{accId:accId});
})
// update the code here
app.get("/epassbook",(req,res)=>{
    const accId = req.query.id;
    var selectCustomerb = "SELECT * FROM debitAmt where debitcustomerId=?";
    var selectCutomerd = "SELECT * FROM creditAmt where creditcustomerId=?";
    db.query(selectCutomerd,[accId],(error,result)=>{
        if(error) throw error;
        db.query(selectCustomerb,[accId],(err,results)=>{
            if(err) throw err;
            res.send(result)
        })
    })
})
app.get("/:links",(req,res)=>{
    const requestedUrl=req.params.links;
    if(requestedUrl==="index")
        res.sendFile(__dirname+"/index.html");
    else if(requestedUrl==="customerLogin")
        res.sendFile(__dirname+"/customer_login.html");
    else if(requestedUrl==="signup")
        res.sendFile(__dirname+"/signup.html");
    else if(requestedUrl=='admin')
        res.sendFile(__dirname+"/admin.html");
    else if(requestedUrl=='signup1')
        res.sendFile(__dirname+"/signup1.html");
})


app.post("/customerSignUp",upload.single('photo'),(req,res)=>{
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    const phone=req.body.phone;
    const email=req.body.email;
    const accId=req.body.accId;
    const address=req.body.address;
    const aadhar=req.body.aadharNumber;
    const bankLoc = req.body.bank_loc;
    const password = req.body.password;

    // console.log(req.file);
    // Photo data from the uploaded file
    const photo = req.file.filename;

    res.cookie('custUserId',accId);
    var ifsc="";
    if(bankLoc==="New York Branch") ifsc = "ABCD1234567"; 
    else if(bankLoc==="San Francisco Branch") ifsc = "EFGH8901234";

    var sql="Insert into bank_customer(bank_cust_fname,bank_cust_lname,bank_cust_phone,bank_cust_emailid,bank_cust_account_id,bank_cust_address,bank_cust_aadhar,bank_cust_branch_loc,bank_cust_branch_ifsc,bank_cust_password,bank_cust_photo) values(?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql,[fname,lname,phone,email,accId,address,aadhar,bankLoc,ifsc,password,photo],(err,result)=>{
        if(err) throw err;
        res.redirect("/profile");
    })
})
app.post("/customerSignUpAdminView",upload.single('photo'),(req,res)=>{
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    const phone=req.body.phone;
    const email=req.body.email;
    const accId=req.body.accId;
    const address=req.body.address;
    const aadhar=req.body.aadharNumber;
    const bankLoc = req.body.bank_loc;
    const password = req.body.password;

    // console.log(req.file);
    // Photo data from the uploaded file
    const photo = req.file.filename;

    res.cookie('custUserIdViewAdmin',accId);
    var ifsc="";
    if(bankLoc==="New York Branch") ifsc = "ABCD1234567"; 
    else if(bankLoc==="San Francisco Branch") ifsc = "EFGH8901234";

    var sql="Insert into bank_customer(bank_cust_fname,bank_cust_lname,bank_cust_phone,bank_cust_emailid,bank_cust_account_id,bank_cust_address,bank_cust_aadhar,bank_cust_branch_loc,bank_cust_branch_ifsc,bank_cust_password,bank_cust_photo) values(?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql,[fname,lname,phone,email,accId,address,aadhar,bankLoc,ifsc,password,photo],(err,result)=>{
        if(err) throw err;
        res.redirect("/profileViewAdmin");
    })
})
app.post("/updateCustomerDetails",upload.single('updatePhoto'),(req,res)=>{
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    const phone=req.body.phone;
    const email=req.body.email;
    const address=req.body.address;
    const aadhar=req.body.aadharNumber;
    const password = req.body.password;
    const bankLoc = req.body.bank_loc;
    const id = req.body.id;
    // console.log(req.file);
    const photo = req.file.filename;
    var ifsc ="";
    if(bankLoc==="New York Branch") ifsc = "ABCD1234567"; 
    else if(bankLoc==="San Francisco Branch") ifsc = "EFGH8901234";

    res.cookie('custUserId',id)
    
    var sql = "UPDATE bank_customer SET bank_cust_fname=?, bank_cust_lname=?, bank_cust_phone =?, bank_cust_emailid=?, bank_cust_address=?,  bank_cust_aadhar=?, bank_cust_branch_ifsc=?, bank_cust_password=?, bank_cust_branch_loc=?,bank_cust_photo = ? where bank_cust_account_id=?";
    db.query(sql,[fname,lname,phone,email,address,aadhar,ifsc,password,bankLoc,photo,id],(err,result)=>{
        if(err) throw err;
        else
        {
            var sql1 = "SELECT * FROM bank_customer WHERE bank_cust_account_id=?";
            db.query(sql1,[id],(error,results)=>{
                if(error) throw error;
                res.redirect("/profileViewAdmin");
            })
        }
    })
});
app.post("/adminLogin",async(req,res)=>{
    const userId=await req.body.userId;
    const ifsc=await req.body.ifsc;
    const password=await req.body.password;
    var sql= "SELECT * from bank_employee where bank_emp_id=?";
    db.query(sql,[userId],(err,results)=>{
        if(err) throw err;
        if(results[0].bank_emp_password!=password || results[0].bank_emp_branch_ifsc!=ifsc)
        {
            res.render("admin",{});
        }
        else{
            // var sql1 = "SELECT * FROM bank_customer WHERE bank_cust_branch_ifsc = (SELECT bank_emp_branch_ifsc FROM bank_employee where bank_emp_branch_ifsc=?)";
            res.cookie(`ifsc`,req.body.ifsc);
            var sql1= "SELECT * FROM bank_customer, bank_employee WHERE bank_emp_branch_ifsc=bank_cust_branch_ifsc AND bank_emp_branch_ifsc=?";
            db.query(sql1,[ifsc],(error,result)=>{
                if(error) throw error;
                res.render("customer_table",{customers:result});
            })
        }
    })
})
app.post("/customerLogin",(req,res)=>{
    const userId = req.body.userId;
    res.cookie('custUserIdViewCustomer',userId);
    var sql = "SELECT * FROM bank_customer WHERE bank_cust_account_id=?"
    db.query(sql,[userId],(err,result)=>{
        if(err) throw err;
        res.render("customer_profile",{customer:result,userInfo:0}); 
    })
})

app.post("/creditMoney", (req, res) => {
    const id = req.body.id;
    const amt = parseInt(req.body.money);
    const selectCustomerSql = "SELECT bank_cust_balance FROM bank_customer WHERE bank_cust_account_id = ?";
    db.query(selectCustomerSql, [id], (err, result) => {
        if (err) throw err;

        const currentBalance = parseInt(result[0].bank_cust_balance);

        const updateCustomerSql = "UPDATE bank_customer SET bank_cust_balance = ? WHERE bank_cust_account_id = ?";
        db.query(updateCustomerSql, [currentBalance + amt, id], (error, resultUpdate) => {
            if (error) throw error;

            const updateBalanceSql = "UPDATE bank_balance SET amt = ? WHERE cust_accId = ?";
            db.query(updateBalanceSql, [currentBalance + amt, id], (errorBalance, resultBalance) => {
                if (errorBalance) throw errorBalance;
                
                res.redirect("/profileViewAdmin");
            });
        });
    });
});


app.post("/debitMoney",(req,res)=>{
    const id = req.body.id;
    const amt = req.body.money;
    var selectcustomer = "SELECT * FROM bank_customer WHERE bank_cust_account_id=?";
    db.query(selectcustomer,[id],(err,result)=>{
        if(err) throw err;

        else if(amt>result[0].bank_cust_balance) res.send("Amount in the account is not available");
        else 
        {
            var amtPresent = result[0].bank_cust_balance;
            var updateCustBalance = "UPDATE bank_customer SET bank_cust_balance = ? WHERE bank_cust_account_id=?";
            db.query(updateCustBalance,[amtPresent-amt,id],(error,results)=>{
                if(error) throw error;

                var updateBalanceSql = "UPDATE bank_balance SET amt = ? WHERE cust_accId = ?";
                db.query(updateBalanceSql,[amtPresent-amt,id],(errors,resultFound)=>{
                    if(errors) throw errors;
                    
                    res.redirect("/profileViewAdmin");
                })
            })
        }
    })
})
app.post("/moneyTransaction",(req,res)=>{
    const accId = req.body.accountId;
    const beneficiaryAccId = req.body.beneficiaryAccId;
    const amt = req.body.amt;
    res.cookie('custUserId',accId);

    var creditCustomersql = "SELECT * FROM bank_balance where cust_accId=?";
    db.query(creditCustomersql,[beneficiaryAccId],(creditCustomerErr,creditCustomerResults)=>{
        if(creditCustomerErr) throw creditCustomerErr;
        const creditCustomerBalance = creditCustomerResults[0].amt;
        
        var debitcustomersql = "SELECT * FROM bank_balance where cust_accId=?";
        db.query(debitcustomersql,[accId],(errors,result)=>{
            if(errors) throw errors;
            
            const debitCustomerBalance = result[0].amt;
            if(amt>debitCustomerBalance) res.redirect("/profile");
            else
            {
                var current = new Date();
                var day = current.getDate();
                var month = current.getMonth()+1;
                var year = current.getFullYear();
                var Transctime = current.toLocaleTimeString();
    
                const debitSql = "INSERT INTO debitAmt(debit_amt, debitcustomerId, debit_time, debit_date, curBalance) VALUES (?, ?, ?, ?, ?)";
                db.query(debitSql, [amt, accId, Transctime, `${year}-${month}-${day}`, debitCustomerBalance - amt], (debitError, Debitresults) => {
                    if (debitError) throw debitError;
                });
                const creditSql = "INSERT INTO creditAmt(credit_amt, creditcustomerId, credit_time, credit_date, curBalance) VALUES (?, ?, ?, ?, ?)";
                db.query(creditSql, [amt, beneficiaryAccId, Transctime, `${year}-${month}-${day}`, parseInt(creditCustomerBalance)+parseInt(amt),beneficiaryAccId], (creditError, creditresults) => {
                    if (creditError) throw creditError;
                });

                var updateDebitDetails = "UPDATE bank_customer set bank_cust_balance=? WHERE bank_cust_account_id=?";
                db.query(updateDebitDetails,[debitCustomerBalance-amt,accId],(Err,Result)=>{
                    if(Err) throw Err;
                    else 
                    {
                        var updateBankBalance = "UPDATE bank_balance SET amt=? WHERE cust_accId=?";
                        db.query(updateBankBalance,[debitCustomerBalance-amt,accId],(debitBankBalanceErr,debitBankBalanceRes)=>{
                            if(debitBankBalanceErr) throw debitBankBalanceErr;
                        })
                    }
                })

                var updateCreditDetails = "UPDATE bank_customer set bank_cust_balance=? WHERE bank_cust_account_id=?";
                db.query(updateCreditDetails,[parseInt(creditCustomerBalance)+parseInt(amt),beneficiaryAccId],(Err,Result)=>{
                    if(Err) throw Err;
                    else 
                    {
                        var updateBankBalance = "UPDATE bank_balance SET amt=? WHERE cust_accId=?";
                        db.query(updateBankBalance,[parseInt(creditCustomerBalance)+parseInt(amt),beneficiaryAccId],(creditBankBalanceErr,creditBankBalanceRes)=>{
                            if(creditBankBalanceErr) throw creditBankBalanceErr;
                        })
                    }
                })
                res.redirect("/profile");
            }
        })
    })
})



// set the themes 
app.post('/change-theme', (req, res) => {
    const selectedTheme = req.body.theme;
    // console.log(selectedTheme);
    res.cookie('theme', selectedTheme, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Cookie expires in 30 days
    
    // Respond with a success message or any necessary data
    res.status(200).json({});
});

app.listen(3000);