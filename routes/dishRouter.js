const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const dishRouter=express.Router();
const authenticate=require('../models/authenticate');
const Dishes=require('../models/dishes');
const cors=require('../models/cors');
dishRouter.use(express.json());
dishRouter.route('/')
.options(cors.corsWithOptionss,(req,res,next)=>{
   res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>
{
   Dishes.find()
   .populate('comments.author')
   .then((dishes)=>
   {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dishes);
   })
   .catch((err) => res.status(400).json(`Error: ${err}`))
})
.post(cors.corsWithOptionss,authenticate.verifyUser,(req,res,next)=>
{
   Dishes.create(req.body)
   .then((dish)=>{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json(dish)
   })
})
dishRouter.route('/:dishId')
.options(cors.corsWithOptionss,(req,res,next)=>{
   res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptionss,(req,res,next)=>{
   res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptionss,authenticate.verifyUser,(req,res,next)=>
{  Dishes.findById(req.params.dishId)
   .then((dish)=>{
      if(dish!=null)
      {
         dish.comments.author=req.user._id;
         dish.comments.push(req.body);
         dish.save()
         .then((dish)=>
         {
            Dishes.findById(dish._id)
            Dishes.populate('comment.author')
            .then((dish))
            {
               res.statusCode=200;
               res.setHeader('Content-Type','application/json');
               res.json(dish);
            }
         })
      }
      else 
      {
         err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
      }
   })
   .catch((err)=>{
      return next(err);
   })
    
})


module.exports=dishRouter;
