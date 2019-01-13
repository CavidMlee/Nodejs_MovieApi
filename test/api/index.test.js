const chai = require('chai');            //npm install mocha chai chai-http --save-dev
const chaiHttp = require('chai-http');    //npm install mocha - g (biz cmd-de mocha yazaraq testi ise saliriq)
const should = chai.should();
const server = require('../../app.js');

chai.use(chaiHttp);

describe('Node Server', ()=>{
    it("(Get/) bize ana seifeni geri qaytarir", (done)=>{
        chai.request(server)
        .get('/')                         //localhost:3000/ portunu yoxlayacaq
        .end((err,res) => {
            res.should.have.status(200);    //deyirikki respons statusu 200 olamlidir ve testimizde bunu yoxlayacaq
            done();
        })
    });
    
});