/**
 *  GENERIC NodeJS REST API for Frontend Applications
*   -------------------------------------------------------
 *  Bajai SZC Türr István Technikum, 13.a szoftverfejlesztő
 *  2024. november
 */

// REQUIREMENTS
require('dotenv').config();
const express = require('express');
var mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const nodemailer = require("nodemailer");
const path = require('path');
const ejs  = require('ejs');
const uuid = require('uuid');
var CryptoJS = require("crypto-js");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const app = express();
const port = process.env.PORT;

// MIDDLEWARE FUNCION
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// DATABASE CONNECTION
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME
});

// NODEMAILER CONFIG
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});

// MULTER CONFIG
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalname = file.originalname.replace(' ', '_');
        const name = originalname.substring(0, originalname.lastIndexOf('.'));
        const ext = originalname.substring(originalname.lastIndexOf('.'));
        cb(null, name + '-' + timestamp + ext);
    }
  });
  
  const upload = multer({ storage: storage })

// APP ROUTES

// send email
app.post('/send', (req, res)=>{
    const {to, subject, content, template} = req.body;

    const templatePath = path.join(__dirname, 'templates', template + '.ejs');
    
    ejs.renderFile(templatePath, {content}, async (err, html)=>{

        if (err){
            return res.send('Error rendering email template!');
        }

        const mailOptions = {
            from: '"Szállásfoglaló App" <' + process.env.SMTP_USER + '>',
            to: to,
            subject: subject,
            html: html
        }

        try {
            result = await transporter.sendMail(mailOptions);
            res.send({ message: 'Az e-mail elküldve!' });
        } catch(error){
            res.send({ message: error });
            
        }
    });
 
});

// user login
app.post('/login/:table', (req, res)=>{
    let email = req.body.email;
    let passwd = req.body.passwd;
    let table = req.params.table;

    let invalidFields = [];

    if (!email || ! passwd){
        if (!email){
            invalidFields.push('email');
        }
        if (!passwd){
            invalidFields.push('passwd');
        }
        res.status(203).send({message: 'Hiányzó adatok!', invalid: invalidFields });
        return;
    }

    pool.query(`SELECT id, name, email, role FROM ${table} WHERE email=? AND passwd=?`, [email, CryptoJS.SHA1(passwd).toString()], (err, results)=>{
        if (err){
            res.status(500).send({message: 'Hiba történt az adatbázis lekérdezés közben! ' + err});
            return;
        }
        if (results.length == 0){
            invalidFields.push('email');
            invalidFields.push('passwd');
            res.status(203).send({message: 'Hibás belépési adatok!', invalid: invalidFields });
            return;
        }
        res.status(200).send({message: 'Sikeres belépés!', invalid: invalidFields, token: generateToken(JSON.stringify(results[0]))});
        return;
    });
});

// user registration
app.post('/reg/:table', (req, res)=>{
    const { name, email, passwd, confirm } = req.body;
    const table = req.params.table;
    
    let invalidFields = [];

    if (!name || !email || !passwd || !confirm){
        if (!name){
            invalidFields.push('name');
        }
        if (!email){
            invalidFields.push('email');
        }
        if (!passwd){
            invalidFields.push('passwd');
        }
        if (!confirm){
            invalidFields.push('confirm');
        }
        res.status(203).send({ message: 'Hiányzó adatok!', invalid: invalidFields });
        return;
    }
  
    if (passwd != confirm){
        invalidFields.push('passwd');
        invalidFields.push('confirm');
        res.status(203).send({ message: 'A megadott jelszavak nem egyeznek!', invalid: invalidFields });
        return;
    }
  
    if (!passwd.match(passwdRegExp)){
        invalidFields.push('passwd');
        invalidFields.push('confirm');
        res.status(203).send({ message: 'A megadott jelszó nem elég biztonságos!', invalid: invalidFields });
        return;
    }

    pool.query(`SELECT * FROM ${table} WHERE email=?`, [email], (err, results)=>{
        if (err){
            res.status(500).send(err);
            return
        }
        if (results.length != 0){
            invalidFields.push('email');
            res.status(203).send({ message: 'Ez az e-mail cím már regisztrálva van!', invalid: invalidFields });
            return
        }
        pool.query(`INSERT INTO ${table} (id, name, email, passwd, role, secret) VALUES('${uuid.v4()}', '${name}', '${email}', SHA1('${passwd}'), 'user', '${uuid.v4()}')`, (err, results)=>{
            if (err){
                res.status(500).send(err);
                return
            }
            res.status(200).send({ message: 'Sikeres regisztráció!', invalid: invalidFields });
            return
        });
    });
});

//TODO: a user tábla public-ként használata biztonsági kockázat, valamit ki lehetne találni
app.get('/public/:table', (req, res)=>{
    let table = req.params.table;
    
    const public_tables = process.env.PUBLIC_TABLES.split(',');

    if (!public_tables.includes(table)){
        sendResults(res, '', {message: 'Nincs jogosultság hozzá!'});
        return
    }

    pool.query(`SELECT * FROM ${table}`,  (err, results)=>{
        sendResults(res, err, results);
    });
});

app.get('/public/:table/:field/:op/:value', (req, res)=>{
    let table = req.params.table;

    const public_tables = process.env.PUBLIC_TABLES.split(',');

    if (!public_tables.includes(table)){
        sendResults(res, '', {message: 'Nincs jogosultság hozzá!'});
        return
    }

    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk'){
        value = `%${value}%`;
    }

    pool.query(`SELECT * FROM ${table} WHERE ${field}${op}'${value}'`,  (err, results)=>{
        sendResults(res, err, results);
    });
});

//TODO: ezt valahogyan jobban megoldani, hogy biztonságos legyen a jelszó visszaállítás
app.patch('/public/:table/:field/:op/:value', (req, res)=>{
    let table = req.params.table;

    const public_tables = process.env.PUBLIC_TABLES.split(',');

    if (!public_tables.includes(table)){
        sendResults(res, '', {message: 'Nincs jogosultság hozzá!'});
        return
    }

    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk'){
        value = `%${value}%`;
    } 
    let fields = Object.keys(req.body);
    let values = Object.values(req.body);
    let updates = [];
    for (let i = 0; i < fields.length; i++) {
        updates.push(`${fields[i]}='${values[i]}'`);
    }
    let str = updates.join(',');    
    pool.query(`UPDATE ${table} SET ${str} WHERE ${field}${op}'${value}'`, (err, results)=>{
        sendResults(res, err, results);
    });
});

// send email with NODEMAILER 
app.post('/sendmail', tokencheck, (req, res)=>{
});

// upload file(s) with MULTER
app.post('/upload', tokencheck, upload.single('file'), (req, res)=>{
    if (!req.file){
        return sendResults(res, '', {message: 'Hiba történt a feltöltéskor!'});
    }
    sendResults(res, '', {message: 'Sikeres képfeltöltés!', file: req.file });
});

//delete files from uploads folder
app.delete('/delete/:filename', tokencheck, (req,res)=>{
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        return sendResults(res, '', {message: 'A fájl nem található'});
    }

    fs.unlink(filePath, (err)=>{
        if (err) {
            console.log(err);
            return sendResults(res, '', {message:'Hiba történt a fájltörlésekor'})
        }
        return sendResults(res, '', {message:'Fájl sikeresen törölve'});
    })
})




// GET all records from :table
app.get('/:table', tokencheck, (req, res)=>{
    let table = req.params.table;
    pool.query(`SELECT * FROM ${table}`,  (err, results)=>{
        sendResults(res, err, results);
    });
});

// GET records from :table by :field
app.get('/:table/:field/:op/:value', tokencheck, (req, res)=>{
    let table = req.params.table;
    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk'){
        value = `%${value}%`;
    }
    pool.query(`SELECT * FROM ${table} WHERE ${field}${op}'${value}'`,  (err, results)=>{
       sendResults(res, err, results);
    });
});

// INSERT record to :table
app.post('/:table', tokencheck, (req, res)=>{
    let table = req.params.table;
    let fields = Object.keys(req.body).join(',');
    let values = "'" + Object.values(req.body).join("','") + "'";
    pool.query(`INSERT INTO ${table} (${fields}) VALUES(${values})`, (err, results)=>{
        sendResults(res, err, results);
    });
});

// UPDATE records in :table by :field
app.patch('/:table/:field/:op/:value', tokencheck, (req, res)=>{
    let table = req.params.table;
    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk'){
        value = `%${value}%`;
    } 
    let fields = Object.keys(req.body);
    let values = Object.values(req.body);
    let updates = [];
    for (let i = 0; i < fields.length; i++) {
        updates.push(`${fields[i]}='${values[i]}'`);
    }
    let str = updates.join(',');    
    pool.query(`UPDATE ${table} SET ${str} WHERE ${field}${op}'${value}'`, (err, results)=>{
        sendResults(res, err, results);
    });
});

// DELETE record(s) from :table by :field
app.delete('/:table/:field/:op/:value', tokencheck, (req, res)=>{
    let table = req.params.table;
    let field = req.params.field;
    let value = req.params.value;
    let op = getOP(req.params.op);
    if (req.params.op == 'lk'){
        value = `%${value}%`;
    }
    pool.query(`DELETE FROM ${table} WHERE ${field}${op}'${value}'`,  (err, results)=>{
       sendResults(res, err, results);
    });
});

// DELETE all records from :table
app.delete('/:table', tokencheck, (req, res)=>{
    let table = req.params.table;
    pool.query(`DELETE FROM ${table}`,  (err, results)=>{
        sendResults(res, err, results);
    });
});

// FUNCTIONS
function getOP(op){
    switch(op){
      case 'eq' : { op = '='; break }
      case 'lt' : { op = '<'; break }
      case 'gt' : { op = '>'; break }
      case 'lte': { op = '<='; break }
      case 'gte': { op = '>='; break }
      case 'not': { op = '!='; break }
      case 'lk' : { op = ' like '; break }
    }
    return op;
}

function sendResults(res, err, results){
    if (err){
        res.status(500).send(err);
        return
    }
    res.status(200).send(results);
}

function tokencheck(req, res, next){
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(400).send('Jelentkezz be!');
  
    const token = authHeader.split(' ')[1];
    try{
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();  
    }catch(error){
      res.status(400).send('Hibás authentikáció!');
    }
}

function generateToken(user) {
    user = JSON.parse(user);
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' })
}

// LISTENING
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

