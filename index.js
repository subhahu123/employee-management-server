var express = require('express');
var app = express();
var request = require('request');
const bodyParser = require('body-parser');


const accountSid = "ACf7b71473a82b5d211a1cef54b6509b0c" ;
const authToken = "cf7328a7ced1745df7b581e2cb4c065a" ;

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/incoming', (req, res) => {
    const twiml = new MessagingResponse();
    var sem ;
    var rollno ;
    var html ;
    var query = req.body.Body;
    query = query.split(" ") ;
    rollno = query[0] ;
    sem = query[1] ;
    console.log(rollno) ;
    console.log(sem) ;

    var base = `https://vast-escarpment-73783.herokuapp.com/student/${sem}/${rollno}`;
  //  res.end(sem);
    request(base, function (error, response, body) {
        body = JSON.parse(body)  
        data = body[0] ;
        console.log(data) ;
            console.log(data);
          html = `<div class="jumbotron" style="padding: 10px;"><label>RollNo. : </label> ${data.rollNo} 
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                                <label>Name : </label> ${data.name} </div> <br>`;
            console.log(html) ;
            var sum = 0;
            var total = 0;

            html += `<table class="table table-striped table-hover table-bordered bordered table-condensed no-margin block-shadow">
                                    <thead>
                                        <tr>
                                            <th style='text-align: center'>Paper Id</th>
                                            <th style='text-align: center'>Marks</th>
                                            <th style='text-align: center'>Credits</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;

            for (key in data.results) {
                var paperid = data.results[key].subject.slice(0, 5);

                console.log(paperid);

                total++;
                sum += parseInt(data.results[key].marks);

                html += `<tr>
                                    <td>${data.results[key].subject}</td>
                                    <td>${data.results[key].marks}</td>
                                    <td>${data.results[key].subject[6]}</td>
                                  </tr>`;

            }
            html += `</tbody>
                            </table>`;

            console.log(sum);
            console.log(total);
            var percentage = sum / total;

            html +=
                `<br><div style="float: right;" ><label> Percentage : </label> <span> ${percentage} </span> &nbsp; &nbsp; &nbsp; &nbsp; </div>`;
            html += `<br> <input id="email">
                      <br> 
                      <button class="btn" onclick="sendmail()" > send report to yourself </button>`;

            console.log(data);
            console.log(html) ;
        //  html = encodeURIComponent(html);
            // console.log("subh@@####" + html.toString()) ;
            twiml.message("Name: " + data.name + "\n" + "Roll No.: " + data.rollNo + "\n" + "Percentage: " + percentage );
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString()) ;
}) ;


          

});



app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

