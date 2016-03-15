var express    = require('express');        // call express

var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var options = {
    apiKey: '',
    username: '',
    format: 'json'
};

var AfricasTalking = require('africastalking')(options);

var port = process.env.PORT || 8000;

app.post('/receiveSms', function(req, res) {
	var from_ = req.body.from;
	var message = req.body.text;
	var to = req.body.to;
	var date = req.body.date;
	var id = req.body.id;

	console.log(from_, to, message, date, id);

	var sms = AfricasTalking.SMS;

	var opts = { to: from_, message: 'Hi, received - ' + message };
	console.log(opts);

	sms.send(opts)
	    .then(function(s) {
	    	console.log(s);
	    })
	    .catch(function (error) {
	    	console.log(error);
	    });

	res.send(200);
});


app.post('/ussd', function (req, res) {
	var sessionId = req.body.sessionId;
	var serviceCode = req.body.serviceCode;
	var phoneNumber = req.body.phoneNumber;
	var text = req.body.text;

	console.log(sessionId, serviceCode, phoneNumber, text);
	var response = '';

	if (text == '') {
		response = "CON Welcome to  \n";
		response += "1: For account info \n";
		response += "2: For lost gas cylinder\n";
		response += "3: For account balance";
	}

	if (text == '1') {
		response = "END You are Jacky, registered on 4th-2016-March";
	}

	if (text == '2') {
		response = "CON Enter 1 for recovery \n";
		response += "Enter 2 for lost and found";
	}

	if (text == '2*1') {
		response += "END I don't care";
	}

	if ( text== '2*2') {
		response += "END: lost found section";
	}

	if (text == '3') {
		response = "END Your balance is 2,000 KES";
	}

	res.contentType("text/plain");
	res.send(response, 200);
});

app.post('/dlr', function(req, res) {
	var messageId = req.body.id;
	var status = req.body.status;

	console.log(messageId, status);
	res.send(200);
});

app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.listen(port);
console.log('Magic happens on port ' + port);