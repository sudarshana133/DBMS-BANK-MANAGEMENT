const db=require("./connection");
const express=require("express");
const bodyParser=require("body-parser");
const cookieParser = require("cookie-parser");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(cookieParser());

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
app.get("/profile",(req,res)=>{
    const userAccId = req.cookies.custUserId;
    var sql = "SELECT * FROM bank_customer where bank_cust_account_id= ?";
    db.query(sql,[userAccId],(err,result)=>{
        if(err) throw err;
        res.render("customer_profile",{customer:result,userInfo:1});
    })
})
app.get("/profile1",(req,res)=>{
    const id = req.query.id;
    var sql = "SELECT * FROM bank_customer where bank_cust_account_id=?";
    db.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.render("customer_profile",{customer:result,userInfo:1});
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
})


app.post("/customerSignUp",(req,res)=>{
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    const phone=req.body.phone;
    const email=req.body.email;
    const accId=req.body.accId;
    const address=req.body.address;
    const aadhar=req.body.aadharNumber;
    const bankLoc = req.body.bank_loc;
    const password = req.body.password;
    res.cookie('customerUserId',accId);
    var ifsc="";
    if(bankLoc==="New York Branch") ifsc = "ABCD1234567"; 
    else if(bankLoc==="San Francisco Branch") ifsc = "EFGH8901234";

    var sql="Insert into bank_customer(bank_cust_fname,bank_cust_lname,bank_cust_phone,bank_cust_emailid,bank_cust_account_id,bank_cust_address,bank_cust_aadhar,bank_cust_branch_loc,bank_cust_branch_ifsc,bank_cust_password) values(?,?,?,?,?,?,?,?,?,?)";
    db.query(sql,[fname,lname,phone,email,accId,address,aadhar,bankLoc,ifsc,password],(err,result)=>{
        if(err) throw err;
        res.redirect("/profile");
    })
})

app.post("/updateCustomerDetails",(req,res)=>{
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    const phone=req.body.phone;
    const email=req.body.email;
    const address=req.body.address;
    const aadhar=req.body.aadharNumber;
    const password = req.body.password;
    const bankLoc = req.body.bank_loc;
    const id = req.body.id;
    var ifsc ="";
    if(bankLoc==="New York Branch") ifsc = "ABCD1234567"; 
    else if(bankLoc==="San Francisco Branch") ifsc = "EFGH8901234";

    res.cookie('custUserId',id)
    
    var sql = "UPDATE bank_customer SET bank_cust_fname=?, bank_cust_lname=?, bank_cust_phone =?, bank_cust_emailid=?, bank_cust_address=?,  bank_cust_aadhar=?, bank_cust_branch_ifsc=?, bank_cust_password=?, bank_cust_branch_loc=? where bank_cust_account_id=?";
    db.query(sql,[fname,lname,phone,email,address,aadhar,ifsc,password,bankLoc,id],(err,result)=>{
        if(err) throw err;
        else
        {
            var sql1 = "SELECT * FROM bank_customer WHERE bank_cust_account_id=?";
            db.query(sql1,[id],(error,results)=>{
                if(error) throw error;
                res.redirect("/profile");
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
    res.cookie('custUserId',userId);
    var sql = "SELECT * FROM bank_customer WHERE bank_cust_account_id=?"
    db.query(sql,[userId],(err,result)=>{
        if(err) throw err;
        res.render("customer_profile",{customer:result,userInfo:1}); 
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
                
                res.redirect("/profile");
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
                    
                    res.redirect("/profile");
                })
            })
        }
    })
})
app.listen(3000);