const chai = require('chai');            //npm install mocha chai chai-http --save-dev
const chaiHttp = require('chai-http');    //npm install mocha - g (biz cmd-de mocha yazaraq testi ise saliriq)
const should = chai.should();
const server = require('../../app.js');

chai.use(chaiHttp);

let token, movieId

//Token almaq testi
describe('/api/movies tests', () => {
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({ username: 'Cavid', password: '12345' })
            .end((err, res) => {
                token = res.body.token;
                //console.log(token)
                done();
            });
    });

    //Butun filimleri cagirmaq testi
    describe('/GET movies', () => {
        it('It should get all movies', (done) => {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })

        });
    });

    //Databazaya birdene film elave etme testi.
    describe('/Post movies', () => {
        it('It should Post a movie', (done) => {
            const movie = {
                title: 'Udemy',
                director_id: "5c33c1d11e185b1de86a65ee",
                category: 'Kamediya',
                country: 'Baki',
                year: 2019,
                imdb_score: 9
            }

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200),
                    res.body.should.be.a('object'),
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    movieId = res.body._id;
                    done();
                });
        });
    });

    //Databazadan id-ye gore filim tapib gostermek testi
    describe('/GET/:movie_id movie', () => {
        it('It should GET a movie by the given Id', (done) => {
            chai.request(server)
                .get('/api/movies/' + movieId)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                });

        });
    });

    //Put update tesi
    describe('/PUT /:movie_id movie', () => {
        it('It should Updaet a movie given by Id', (done) => {
            const movie = {
                title: 'Nagil',
                director_id: "5c33c1d11e185b1de86a65ee",
                category: 'Dram',
                country: 'Azerbaycan',
                year: 2017,
                imdb_score: 7
            }

            chai.request(server)
                .put('/api/movies/' + movieId)
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200),
                    res.body.should.be.a('object'),
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);

                    done();
                });
        });
    });
     //Delete silmek tesi
     describe('/DELETE /:movie_id movie', () => {
        it('It should Delete a movie given by Id', (done) => {

            chai.request(server)
                .delete('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200),
                    res.body.should.be.a('object'),
                    res.body.should.have.property('status').eql(1);
                    
                    done();
                });
        });
    });
});