var application_root = __dirname,
    express = require("express"),
    path = require("path");
var databaseUrl = "localhost:27017/nodeangulardb"; // "username:password@example.com/mydb"
var collections = ["things"]
var db = require("mongojs").connect(databaseUrl, collections);
var app = express();
console.log("Db console");
// Config

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.get('/api', function (req, res) {
    res.send('Ecomm API is running');
});

app.get('/getAllUsers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    db.things.find().sort( { _id: -1 } , function (err, users) {
        if (err || !users || users.length == 0) var str = '[]';
        else {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            var str = '[';
            users.forEach(function (user) {
                str = str + '{ "id" : "' + user._id + '", "name" : "' + user.username + '", "password" : "' + user.password + '", "email" : "' + user.email + '"},' + '\n';
            });
            str = str.trim();
            str = str.substring(0, str.length - 1);
            str = str + ']';
        }
        res.end(str);
    });
});

app.get('/deleteUsers/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    var deleteId = req.params.id;
    if(deleteId){
        db.things.remove( { _id : db.ObjectId(deleteId) }, true , function(){
            res.end("User deleted");
        });
    }else{
        res.end("User not deleted");
    }
});

app.get('/getUser/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    var userId = req.params.id;
    if(userId){
        db.things.findOne({
            _id: db.ObjectId(userId)
        }, function(err, doc) {
            // doc._id.toString() === '523209c4561c640000000001'
            /*console.log(err);
            console.log(doc);
            console.log(JSON.stringify(doc));*/
            res.end(JSON.stringify(doc));
        });
    }else{
        res.end("User not found");
    }
});

app.post('/insertUser', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //user = req.body.username;
    //passwd = req.body.password;
    //emailid = req.body.email;
    var jsonData = JSON.parse(req.body.mydata);
    var saveId = jsonData.id;
    delete jsonData.id;
    if(saveId != 0) {
        // find all named 'mathias' and increment their level
        db.things.update({_id:db.ObjectId(saveId)}, {$set:jsonData}, {multi:false}, function (err, saved) {
            if (err || !saved) res.end("User not updated");
            else res.end("User updated");
        });
    }else{
        /*console.log(saveData);
        res.end(JSON.stringify(saveData));*/
        db.things.save(jsonData, function (err, saved) {
            if (err || !saved) res.end("User not saved");
            else res.end("User saved");
        });
    }
});




app.listen(1212);