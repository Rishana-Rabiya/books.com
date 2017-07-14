
//var Author = require('../models/author_info');
var mongoose = require('mongoose');
var Book = require('../models/book_info');
var unique = require('../routes/unique.js');


exports.createBook = function(data,callback){
        unique.idGenerator(function(id){
            Book.create({
                book_id:id,
                isbn : data.isbn,
                Book_Name: data.title,
                category: data.cat,
                Release_year: data.ryear,
                author:data.aname,
                edition:data.ed,
                stack_no:data.stack,
                status:"available",
                publisher :data.pub,
                image : "images/no.jpg"
            },function(err,result){
                if(err)
                throw err;
                callback(result);
            });
        });
        }




//book find
exports.findBook = function(callback){
    Book.aggregate(
        [{
            $match : {
                status : "available"
            }
        },
        {
            $group : {
                _id : "$isbn",
                isbn:  {$first:'$isbn'},
                Book_Name : {$first:'$Book_Name'},
                Release_year : { $first: '$Release_year' },
                edition : {$first:'$edition'},
                publisher : { $first: '$publisher' },
                category : {$first:'$category'},
                stack_no : { $first: '$stack_no' },
                author : {$first:'$author'},
                image: {$first:'$image'},
                count: { $sum: 1 }
            }
        }
    ],function(err,res){
        if(err)
        throw err;
        callback(res);
    });
}

exports.bookFindFilter=function(data,callback){
        var text = data.search;
        Book.aggregate(
            [{
                $match : {
                    status:"available",
                    $or:[{category:new RegExp(text, "i")},{ Book_Name: new RegExp(text, "i") },{ author: new RegExp(text, "i") }]
                }
            },
            {
                $group : {
                    _id : "$isbn",
                    isbn:  {$first:'$isbn'},
                    Book_Name : {$first:'$Book_Name'},
                    Release_year : { $first: '$Release_year' },
                    edition : {$first:'$edition'},
                    publisher : { $first: '$publisher' },
                    category : {$first:'$category'},
                    stack_no : { $first: '$stack_no' },
                    author : {$first:'$author'},
                    image :{$first:'$image'},
                    count: { $sum: 1 }
                }
            }
        ]
        ,
        function(err,res){
            if(err)
            throw err;
            console.log(res);
            callback(res);
        });
    }

exports.findAbook=function(id,callback){
    Book.findOne({isbn:id,status:"available"},function(err,result){
        if(err)
        throw err;
        callback(result);
    });

}
exports.findBookInfo=function(id,callback){
    Book.findOne({isbn:id},function(err,result){
        if(err)
        throw err;
        callback(result);
    });

}



exports.bookAbook=function(id,callback){
    console.log("inside the bookAbook");
    Book.findByIdAndUpdate(id, {
            $set: {
                status: 'not available'
            }
        })
        .exec(function (err, book) {
            if (err) throw err;
            console.log('Updated Book!');
            console.log(book);
            callback(book);
        });
}
exports.makeAvailable=function(id,callback){
    Book.findByIdAndUpdate(id, {
            $set: {
                status:'available'
            }
        })
        .exec(function (err, book) {
            if (err) throw err;
            console.log('Updated Book!');
            console.log(book);
            callback(book);
        });
}
exports.listsAvailable = function(callback){
    Book.find({status:"available"},function(err,res){
        if(err)
        throw err;
        callback(res);
    })
}
exports.listsNotAvailable = function(callback){
    Book.find({status:"not available"},function(err,res){
        if(err)
        throw err;
        callback(res);
    })
}
exports.DeleteBook = function(id,callback){
    Book.findByIdAndRemove(id,function(err,book){
        if(err) throw err
        if(book){
            callback(book);
        }

    });
}
exports.findAllBook = function(callback){
    Book.aggregate(
        [
        {
            $group : {
                _id : "$isbn",
                isbn:  {$first:'$isbn'},
                Book_Name : {$first:'$Book_Name'},
                Release_year : { $first: '$Release_year' },
                edition : {$first:'$edition'},
                publisher : { $first: '$publisher' },
                category : {$first:'$category'},
                stack_no : { $first: '$stack_no' },
                author : {$first:'$author'},
                image : {$first:'$image'},
                count: { $sum: 1 }
            }
        }
    ],function(err,res){
        if(err)
        throw err;
        callback(res);
    });

}


exports.updateBook=function(data,callback){

    Book.update({isbn:data.isbn},{
            $set: {
                Book_Name: data.Book_Name,
                category: data.category,
                Release_year: data.Release_year,
                author:data.author,
                edition:data.edition,
                stack_no:data.stack_no,
                publisher :data.publisher


            }

        },{"multi": true})
        .exec(function (err, num) {
            if (err) throw err;

            console.log(num);
            callback(num);
        });
}
exports.findEveryBook = function(callback){
    Book.find({},function(err,res){
        if(err)
        throw err;
        callback(res);
    })
}
