const express = require('express')
const fs = require('fs')
const app = express()
const formidable = require('formidable')
const path = require('path');
const http = require('http');
const getRawBody = require('raw-body')
const contentType=require('content-type')
const ejs = require('ejs')
const alert = require('alert');
const bodyParser = require('body-parser');
const port=  process.env.PORT || 3000;

const {
  type
} = require('os');
const nodemailer = require('nodemailer');
const {
  send
} = require('process');
const { error } = require('console');
const { constants } = require('buffer');



app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'stored')));
app.set('view engine', 'ejs');




app.post('/download', (req, res) => {
  if (req.body.link == "") {
    res.sendStatus(404);
  } else {
    var lnk = req.body.link.split('/').pop().trim();
    console.log(lnk);
     res.download(path.join(__dirname, lnk))
     
    
    
    
  }



});

app.get('/', (req, res) => {
   res.render('index')
})



app.get('/share', (req, res) => {

  res.render('Share')
});

app.post('/filetoupload', (req, res) => {
  
    var form = formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      
      var oldpath = files.filetoupload.path;
      var newpath = path.join(__dirname , files.filetoupload.name);
      fs.rename(oldpath, newpath, (err) => {
        urlname = req.hostname + '/stored/' + files.filetoupload.name;
        console.log('DD')
        res.render('Download', {link:  urlname, title: " Your Link is Ready"})

      })
   

  

    })



    
});

app.get('/down', (req,res) => {
  res.render('Download',{link:null, title:"Paste your link to Download"});
});

app.post('/mail', (req, res) => {
  var sender = req.body.sender;
  var receiver = req.body.receiver;
  var link = req.body.link;

  console.log(sender, receiver, link)

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rgoel766@gmail.com',
      pass: 'rxlvlrwfzychzcsa'
    }
  });

  var mailOptions = {
    from: sender,
    to: receiver,
    subject: sender + 'is sending Email by ShareDigi',
    text: 'This link has been shared with you' + link
  };


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send("Email Sent");
    }
  });



});

app.get('/download/:uid', (req, res) => {

  var url = String(req.params.uid)
  res.download(path.join(__dirname+'/stored/', url))
})
app.listen(port, (req, res) => {
  console.log(`App listening on port ${port}`);
});