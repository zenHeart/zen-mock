//基准测试验证 mockserver 功能
const path = require('path');
const supertest = require('supertest');
const MockServer = require('../lib/MockServer');
const { expect } = require('chai');


describe('fixture', function (done) {
    describe('测试基础功能', function () {
        let mockServer = new MockServer({
            root: path.join(__dirname, 'fixture/mock')
        })
        it('support cors',function(done) {
            supertest(mockServer.app).get('/cors')
            .expect('Access-Control-Allow-Origin', '*')
            .expect(200)
            .then(response => {
                let {body} = response;
                expect(body.data).to.eq('test');
                done()
            })
            .catch(done)  
        })


        it('测试 number', function (done) {
            supertest(mockServer.app)
                .get('/number')
                .expect(200, JSON.stringify(12),done);
             })

        it('测试 null', function (done) {
            supertest(mockServer.app)
                .get('/null')
                .expect(200, null, done);
        })

        it('没有 req,resp 配置则将整个配置内容作为 body 返回', function () {
            supertest(mockServer.app)
                .get('/basic')
                .expect(200, {
                    code: "000000",
                    msg: "ok",
                    data: {
                        foo: 1
                    }
                }, done)
        })

        it('测试 index 默认为根目录', function (done) {
            supertest(mockServer.app)
                .get('/')
                .expect(200, JSON.stringify('raw json'), done);
        })


        it('支持 mockjs 配置', function (done) {
            supertest(mockServer.app)
                .get('/mock')
                .expect(200)
                .then(res => {
                    let { body } = res;
                    expect(body).to.have.nested.property('code')
                    expect(body).to.have.nested.property('msg')
                    expect(body).to.have.nested.property('data.record')
                    expect(body).to.have.nested.property('data.record[0]')
                    expect(body).to.have.nested.property('data.record[0].id')
                    done();
                }).catch(done)
        })

        it('支持函数配置', function (done) {
            supertest(mockServer.app)
                .get('/function')
                .expect(200, {
                    a: 1
                }, done)
        })

        it('支持 req.path', function (done) {
            supertest(mockServer.app)
                .get('/test-req')
                .expect(200, {
                    test: 1
                }, done)
        })

        it('支持 req.method', function (done) {
            supertest(mockServer.app)
                .post('/config-method')
                .send({
                    a: 1,
                    b: 2
                })
                .expect(200).then(res => {
                    let { body } = res;
                    expect(body).to.have.nested.property('code');
                    expect(body).to.have.nested.property('msg');
                    expect(body).to.have.nested.property('data.req');
                    expect(body).to.have.nested.property('data.req.a');
                    done();
                }).catch(done)
        })

        it('测试 req params', function (done) {
            supertest(mockServer.app)
                .post('/config/sdf')
                .send({
                    a: 1,
                    b: 2
                })
                .expect(200).then(res => {
                    let { body } = res;
                    expect(body).to.have.nested.property('code');
                    expect(body).to.have.nested.property('msg');
                    expect(body).to.have.nested.property('data.req');
                    expect(body).to.have.nested.property('data.req.a');
                    expect(body).to.have.nested.property('data.params');
                    expect(body).to.have.nested.property('data.params.configId', 'sdf');
                    done();
                }).catch(done)
        })


        it('测试默认 static', function (done) {
            supertest(mockServer.app)
                .get('/static/index.js')
                .send({
                    a: 1,
                    b: 2
                })
                .expect('Content-Type', /javascript/)
                .expect(200, done)
        })


        it('测试递归目录', function (done) {
            supertest(mockServer.app)
                .post('/sub/ignore/foo')
                .expect(200, { test: 1 }, done)
        })

        it('测试递归目录 index', function (done) {
            supertest(mockServer.app)
                .get('/sub')
                .expect(200, 'sub home', done);
        })


        it('header',function(done) {
            supertest(mockServer.app)
                .get('/header')
                .expect('Set-Cookie', 'name=zenheart')
                .expect('token', /^\d{10}$/)
                .expect(200)
                .then(response => {
                    let {body} = response;
                    expect(body.code).to.match(/^\d{6}$/);
                    expect(body.msg).to.equal('ok');
                    done()
                })
                .catch(done)  
        })
    })

    describe('测试配置项', function () {
        let mockServer = new MockServer({
            root: path.join(__dirname, 'fixture/mock'),
            ignoreDir: ['ignore'],
            staticDir: 'assets',
            extPattern: '*.js'
        })


        it('extPattern', function (done) {
            supertest(mockServer.app) //不解析 json
                .get('/basic')
                .expect(404, done)
        })
        it('ignoreDir', function (done) {
            Promise.all([
                supertest(mockServer.app)
                    .get('/ignore')
                    .expect(404),

                supertest(mockServer.app) //非递归忽略
                    .post('/sub/ignore/foo')
                    .expect(200, {
                        test: 1
                    }),
            ]).then(() => { done() }).catch(done)

        })

        it('staticDir', function (done) {
            Promise.all([
                supertest(mockServer.app) //默认静态文件变为配置读取
                    .get('/static')
                    .expect(200, {}), //对配置宽容,非模块则默认返回 {}

                supertest(mockServer.app) //新静态文件直接读取
                    .get('/assets/index.js')
                    .expect('Content-Type', /javascript/)
                    .expect(200)
            ]).then(() => { done() }).catch(done)

        })
    })

}) 
