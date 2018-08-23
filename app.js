
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var request = require('request');
var cors = require('cors');
var parser = require('xml2json');
// const paginate = require('express-paginate');

// keep this before all routes that will use pagination
// app.use(paginate.middleware(10, 50));

app.use(cors());

app.use((req, res, next) => {
    if (/\/xml$/.test(req.headers['content-type'])) {
        req.body = parser.toJson(req.body.toString(), { object: true });
    }
    next();
});

const dbconfig = require('./config/database.config')

const note = require('./routes/note.routes.js');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.raw({ type: () => true }));
app.use(bodyParser.json());

// parse requests of content-type - application/json
app.use(bodyParser.json());

mongoose.connect(dbconfig.url)

.then(() => {
    console.log("successfully connected");
}).catch(err => {
    console.log("fucked UP");
    process.exit();
})

app.use('/notes', note);
app.use('/allNotes', note);
app.use('/oneNotes',note);

app.get('/fuckjson',(req, res) => {
    res.json("what the fuck is this");
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

// var parser = new x2j.Parser();

app.route('/testRoute/')
  .get(function(req, res){
    request({
      method: 'GET',
      uri: 'https://www.goodreads.com/api/index#search.books',
      headers: {'Authorization': 'RDfV4oPehM6jNhxfNQzzQ ' + 'fu8fQ5oGQEDlwiICw45dGSuxiu13STyIrxY0Rb6ibI'}
    },
         function (error, response, body){
          if(!error && response.statusCode == 200){
            JSON.stringify(body)
        res.set('Content-Type', 'application/json');
         res.send(result);
        // console.log("body", result.page);
          }
    })
  });
  

  app.get('/search/:page', function(req, res){
        var page = req.params.page ;
        var perPage = 9;
        let form = result;

        form.find({page})
        .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, testRoute){
          if(err){
              return next(err)
          }
          res.render('./views/index.html',{
              pages: Math.ceil(count / perPage)
          });


      })
  })

//   app.get('/testRoute/:page', function(req, res){
//       var perPage = 9;
//       var page = req.params.page || 1;
//         let url= "https://www.goodreads.com/api/index#search.books";
      
//         url.find({})
//       .skip((perPage * page) - perPage)
//       .limit(perPage)
//       .exec(function(err, testRoute){
//           if(err){
//               return next(err)
//           }
//           res.render('./views/index.html',{
//               pages: Math.ceil(count / perPage)
//           });


//       })
//   })

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
  });

http.listen(5000, function(){
  console.log('listening on *:5000');
});

