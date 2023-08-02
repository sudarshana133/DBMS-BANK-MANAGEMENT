const db=require("./connection");
const express=require("express");
const bodyParser=require("body-parser");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.get("/customers",(req,res)=>{
    var sql= "SELECT * FROM customer";
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.render("customer_table",{customers:result});
    })
})

app.get("/deleteCustomer",(req,res)=>{
    var id=req.query.id;
    var sql= "Delete from customer where id ='"+id+"'";
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.redirect("/customers");
    })
})

app.get("/updateCustomers",(req,res)=>{
    var id=req.query.id;
    var sql= "SELECT * FROM customer where id = ?";
    db.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.render("update_details",{customers:result});
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


app.post("/customerLogin",(req,res)=>{
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    // const dob=req.body.dateOfBirth;
    const phone=req.body.phone;
    const email=req.body.email;
    const accId=req.body.accId;
    const address=req.body.address;
    const aadhar=req.body.aadharNumber;
        var sql="Insert into customer(firstname,lastname,phonenum,email,accId,address,aadharNum) values(?,?,?,?,?,?,?)";
        db.query(sql,[fname,lname,phone,email,accId,address,aadhar],(err,result)=>{
            if(err) throw err;
            res.send("Student successfully registered");
        })
})

app.post("/updateCustomerDetails",(req,res)=>{
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    // const dob=req.body.dateOfBirth;
    const phone=req.body.phone;
    const email=req.body.email;
    const accId=req.body.accId;
    const address=req.body.address;
    const aadhar=req.body.aadharNumber;
    const id=req.body.id;
    var sql = "UPDATE customer SET firstname=?, lastname=?, phonenum =?, email=?, accId=?, address=?,  aadharNum=? where id=?";
    db.query(sql,[fname,lname,phone,email,accId,address,aadhar,id],(err,result)=>{
        if(err) throw err;
        res.redirect("/customers");
    })
})
app.listen(3000);