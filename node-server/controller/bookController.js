
//var Author = require('../models/author_info');
var mongoose = require('mongoose');
var Book = require('../models/book_info');


exports.createBook = function(data,callback){
            Book.create({
                isbn : data.isbn,
                Book_Name: data.title,
                category: data.cat,
                Release_year: data.ryear,
                author:data.aname,
                edition:data.ed,
                stack_no:data.cat,
                status:"available",
                publisher :data.pub
            },function(err,result){
                if(err)
                throw err;
                callback(result);
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
                Book_Name : {$first:'$Book_Name'},
                Release_year : { $first: '$Release_year' },
                edition : {$first:'$edition'},
                publisher : { $first: '$publisher' },
                category : {$first:'$category'},
                stack_no : { $first: '$stack_no' },
                author : {$first:'$author'},
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
exports.findAuthor=function(data,callback){
  Author.findOne({_id:data},function(err,res){
    if(err)
    throw err;
    callback(res);
  });
}

exports.bookAbook=function(id,callback){
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
