const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();

//Models
const Director = require('../models/Director')

//Post isi
router.post('/', (req, res, next) => {

  const director = new Director(req.body);

  const promise = director.save();
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });

});

//Get All Api
router.get('/', (req, res, next) => {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true                  //Joini olmayan datalarida goster
      }
    },
    {
      $group: {                                          //gruplama etdik bir adamda bir nece joinden gelen object olabiler
        _id: {
          _id:"$_id",
          name:"$name",
          surname:"$surname",
          bio:"$bio"
        },
        movies:{
          $push:"$movies"                     //$unwind-deki $path-in qarsisindaki element($movies)
        }
      }
    },
    {
      $project:{                             //bize lazim olna formada lazimli fieldleri goster
        _id:"$_id._id",
        name:"$_id.name",
        surname:"$_id.surname",
        bio:"$_id.bio",
        movies:"$movies"
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

//Directors Id Api
router.get('/:director_id', (req, res, next) => {
  const promise = Director.aggregate([
    {
      $match:{
        "_id":mongoose.Types.ObjectId(req.params.director_id) 
      }
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true                  //Joini olmayan datalarida goster
      }
    },
    {
      $group: {                                          //gruplama etdik bir adamda bir nece joinden gelen object olabiler
        _id: {
          _id:"$_id",
          name:"$name",
          surname:"$surname",
          bio:"$bio"
        },
        movies:{
          $push:"$movies"                     //$unwind-deki $path-in qarsisindaki element($movies)
        }
      }
    },
    {
      $project:{                             //bize lazim olna formada lazimli fieldleri goster
        _id:"$_id._id",
        name:"$_id.name",
        surname:"$_id.surname",
        bio:"$_id.bio",
        movies:"$movies"
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// update Api
router.put('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body,
    {
      new:true                               //update edenkimi yeni datani gosterecek(update olunmusu)
    }
    );

  promise.then((data) => {
    if (!data) {
      next({ message: 'Bu director tapilmadi.', code: 99 })
    }
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});


//Delete Api
router.delete('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndRemove(req.params.director_id);
  promise.then((data) => {
    if (!data) {
      next({ message: 'Bu director tapilmadi.', code: 99 })
    }
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});

module.exports = router;