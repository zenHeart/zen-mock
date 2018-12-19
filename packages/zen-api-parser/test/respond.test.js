
const respond = require('../lib/respond');
const express = require('express');
const app= express();

const { expect } = require('chai');
const request = require('supertest');

/**
 * 请求对象测试,
 * 返回 mockjs 生成的请求对象
 */
describe('respond', function () {
    it('null', function (done) {
        let handle = respond(null);
        app.get('/null',handle);

        expect(handle).to.be.an.instanceof(Function)
        request(app)
            .get('/null')
            .expect(200,null,done);

    })
    it('传入函数,原样返回', function (done) {
        let handle = (req,res) => { res.json({foo:1})};
        app.get('/function',handle);

        expect(respond(handle)).to.equal(handle);
        request(app)
        .get('/function')
        .expect(200,{foo:1},done);
    })
    it('传入对象,返回函数', function (done) {
        let handle = respond({body:{a:/\d{11}/}});
        app.get('/object',handle);
        
        expect(handle).to.an.instanceof(Function)
        request(app)
        .get('/object')
        .expect(200)
        .then(res => {
            let { body } = res;
            expect(body).to.have.nested.property('a')
            done();
        }).catch(done)
    })
})

