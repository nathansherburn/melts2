var express = require('express')
var connect = require('connect')
var CAS = require('cas')
var path = require('path')
var cas = new CAS({base_url: 'https://my.monash.edu.au/authentication/cas', service: 'http://melts-dev.eng.monash.edu'})
var app = express()

app.set("views", __dirname + "/templates");
app.engine('html', require('hogan-express'))
app.set('view engine', 'html')			//# use .html extension for templates
app.set('layout', 'layout')				//# use layout.html as the default layout
// app.set('partials', {foo: 'foo'})	//# define partials available to all pages
// app.enable('view cache')


app.use(connect.urlencoded()) //for getting post information such as forms
app.use(express.static(path.join(__dirname, 'public'))) //for serving static files such as css


app.get('/', function (req, res) {
	console.log(req.param('ticket'))
	var ticket = req.param('ticket')
	if (ticket) {
		cas.validate(ticket, function(err, status, username) {
			if (err) {
		        // Handle the error
		        console.log('there was an error')
		        res.send({error: err})
		    } else {
		        // Log the user in
		        console.log('the user was logged in')
		        res.send({status: status, username: username})
		    }
		})
	} else {
		res.redirect('/login')
	}
})

app.get('/quiz', function (req, res) {
	res.render('quiz', {
		'question': 'hello',
		'answer1': 'the goat',
		'answer2': 'the goat 2',
		'answer3': 'the goat 34',
		'answer4': 'the goa dfsd fsdf s f sfsfs f asdfs dfs fdgd f gt'	
	})
})

app.get('/login', function (req, res) {
	res.render('login')
})

app.get('/home', function (req, res) {
	res.render('home')
})


// app.post('/home', function (req, res) {
// 	// res.end('your username is ' + req.body.username + " and your password is " + req.body.password)
// 	res.render('home', {username: req.body.username, password: req.body.password})
// })

app.listen(8000)
console.log('server running on 8000')