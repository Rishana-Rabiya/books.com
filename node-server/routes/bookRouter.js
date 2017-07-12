var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bookRouter = express.Router();
//var multer = require('multer');
//var upload = multer({ dest: 'uploads/' })
var operations = require('../controller/bookController');
var verify = require('../routes/verify');
var orderOperations = require('../controller/orderController');


bookRouter.route('/upload')
.post(verify.verifyUser,function (req, res, next) {
    operations.createBook(req.body,function(result){
        if(result){
            console.log(result);
            res.json({success:true});
        }
        else{
            res.json({success:false});
        }
    });
})

.put(verify.verifyUser,function (req, res, next) {
    operations.updateBook(req.body,function(result){
        if(result){
            console.log(result);
            res.json({success:true});
        }
        else{
            res.json({success:false});
        }
    });
});




bookRouter.route('/')
.get(verify.verifyUser,function(req,res,next){
    operations.findBook(function(result){
        if(result){
            res.json({book:result});
        }
        else {
        res.json({success:false});
        }
    });
});


bookRouter.route('/find')
.post(verify.verifyUser,function(req,res,next){
    var result = req.body;
    console.log(result);
    operations.bookFindFilter(result,function(result){
        if(result){
            res.json({books:result});
        }
        else {
            res.json({success:false});
        }
    });
});

bookRouter.route('/find/:id')
.get(verify.verifyUser,function(req,res,next){
    var id = req.params.id;
    operations.findAbook(id,function(result){
        if(result){
            res.json({book:result});
        }
        else {
            res.json({success:false});
        }

    });
})

.delete(verify.verifyUser,function (req, res, next) {
  operations.DeleteBook(req.params.id,function(result){
    if(result){
      res.send({book:result});
    }
    else{
        res.send({book:"failure"});
    }

  });
});


bookRouter.route('/list/:id')
.get(verify.verifyUser,function(req,res,next){
    var id = req.params.id;
    if(id=="available"){
        operations.listsAvailable(function(result){
            if(result){
                res.json({books:result});
            }
            else {
                res.json({success:false})
            }
        });

    }
    else if(id=="not available"){
        operations.listsNotAvailable(function(result){
            if(result){
                res.json({books:result});
            }
            else {
                res.json({success:false})
            }
        });

    }

});


bookRouter.route('/action')
.put(verify.verifyUser,function(req,res,next){
    var id = req.body.id;
    var flag = req.body.flag;
    console.log(id,flag);
    if(flag=="enable"){
        operations.makeAvailable(id,function(result){
            if(result){
                res.json({books:result});
            }
            else {
                res.json({success:false})
            }
        });

    }
    else if(flag=="disable"){
        console.log("inside the disable function");
        operations.bookAbook(id,function(result){
            if(result){
                res.json({books:result});
            }
            else {
                res.json({success:false})
            }
        });

    }

});


bookRouter.route('/all')
.get(verify.verifyUser,function(req,res,next){
    operations.findAllBook(function(result){
        if(result){
            res.json({books:result});
        }
        else {
            res.json({success:false});
        }

    });
});
bookRouter.route('/every')
.get(verify.verifyUser,function(req,res,next){
    operations.findEveryBook(function(result){
        if(result){
            res.json({books:result});
        }
        else {
            res.json({success:false});
        }

    });
});
bookRouter.route('/info/:id')
.get(verify.verifyUser,function(req,res,next){
    operations.findBookInfo(req.params.id,function(result){
        if(result){
            res.json({books:result});
        }
        else {
            res.json({success:false});
        }

    });
});



bookRouter.route('/same')
.post(function(req,res,next){
    console.log("inside the post function");
    orderOperations.orderSame(req.body,function(result){
        if(result.length!=0){
            console.log("result",result);
            res.json({flag:"exist"});
        }
        else {
            res.json({flag:"not exist"});
        }
    });
});































module.exports = bookRouter;
