const express = require('express');
const router = express.Router();

//Models
const Movie = require('../models/Movie')

//getAll api
router.get('/', (req, res) => {                         //getAll api-si    find ile bos morterze qoyub butun datani cekdik
  const promise = Movie.aggregate([
    {
      $lookup:{
        from:'directors',
        localField:'director_id',
        foreignField:'_id',
        as:'director'

      }
    },
    {
      $unwind:'$director'
    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});

//Top10 list
router.get('/top10', (req, res) => {                         
  const promise = Movie.find({}).limit(10).sort({imdb_score:-1});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});

//Movie Id Api
// Burda url-in sonunda Id-ni yaziriq.Bu id-ni goturmek ucun req.params.movie_id -den istifade edirik
router.get('/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);
  promise.then((data) => {
    if (!data) {
      next({ message: 'Bu filim tapilmadi.', code: 99 })

    }
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});

// update Api
// id-ye gore title-i udate etdik
router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    {
      new:true                               //update edenkimi yeni datani gosterecek(update olunmusu)
    }
    );

  promise.then((data) => {
    if (!data) {
      next({ message: 'Bu filim tapilmadi.', code: 99 })
    }
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});

//Delete Api
router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  promise.then((data) => {
    if (!data) {
      next({ message: 'Bu filim tapilmadi.', code: 99 })
    }
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});

//Between
router.get('/between/:start_year/:end_year', (req, res) => {   
  const {start_year,end_year} = req.params;    

  const promise = Movie.find(
    {                                                                         // '$gte'  boyukdur beraber  demekdir 
      year:{'$gte':parseInt(start_year),'$lte':parseInt(end_year) }           // '$lte'  kicikdir beraber demekdir
    }                                                                         // '$gt' boyukdur, '$lt' kicikdir demekdir
    );

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });
});




//Post isi
router.post('/', (req, res, next) => {
  const { title, imdb_score, category, country, year } = req.body;
  const movie = new Movie({                    //belede yaza bilerik:  const movie = new Movie(req.body);
    title: title,
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year
  });


  const promise = movie.save();
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  });

});


module.exports = router;
