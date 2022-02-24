var express = require('express');
const { append } = require('express/lib/response');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
    return res.render('index.ejs');
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    var data = req.body;
    // le champ  ne peut être vide (null)
    if (!data.email || !data.username || !data.password || !data.password_Confirmation) {
        res.send();
    } else {

        if (data.password == data.password_Confirmation) {
            //requete pour tester l existence des personnes de ce email
            User.findOne({ email: data.email }, function (err, result) {
                if (!result) {
                    var id;
                    //tester si l enregistrement est le premier dans notre base de donnes
                    User.findOne({}, function (err, result) {
                        if (result) {
                            id = result.unique_id + 1;
                        } else {
                            id = 1;
                        }

                        var new_Person = new User({
                            unique_id: id,
                            email: data.email,
                            username: data.username,
                            password: data.password,
                            password_Confirmation: data.password_Confirmation

                        });

                        new_Person.save(function (err, Person) {
                            if (err)
                                console.log(err);
                            else
                                console.log("Success");
                        })
                    }).sort({ _id: -1 }).limit(1);
                    res.send({ "Success": "You are regestered,You can login now." });


                } else {
                    res.send({ "Success": "Email is already used." });
                }
            });




        } else {
            res.send({ "Success": "password is not matched" });
        }


    }
});

router.get('/login', function (req, res, next) {
    return res.render('login.ejs');
})


//pour s authentifier
router.post('/login', function (req, res, next) {
    console.log(req.body);
    User.findOne({ email: req.body.email }, function (err, result) {

          if(!result){

              res.send({"Succes":"Email is not registred"})
          }else{
                 if(result.password==req.body.password){
                    console.log({"Success":"Done login"}); 
                    req.session.userId=result.unique_id;
                    res.send({"Success":"Success!"});
                 }else{
                     res.send({"Success":"Wrong password!"});
                 }
        }
 })
});

router.get('/profile',function(req,res,next){
console.log("profile");
User.findOne({unique_id:req.session.userId},function(err,result){
    console.log("your information");
    console.log(result);

   if(!result){
       res.redirect('/');
   }else{
       return res.render('data.ejs',{"name":result.username,"email":result.email});
   }

});
      

});

//pour quitter logout il detruire la session

router.get('/logout',function(req,res,next){
  console.log('logout');
  if(req.session){
       //delete session object
       req.session.destory(function(err){
           if(err){
           return next(err)
           }else{

            return res.redirect('/');
           }

       })
  }

})

module.exports = router;