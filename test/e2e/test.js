'use strict'
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const rm = require('rimraf').sync
const exists = require('fs').existsSync
const crypto = require('crypto')
const render = require('consolidate').ejs.render
const inquirer = require('inquirer')
const async = require('async')
const extend = Object.assign || require('util')._extend
const generate = require('../../lib/generate')

const MOCK_TEMPLATE_REPO_PATH = './test/e2e/mock-template-repo'
const MOCK_TEMPLATE_BUILD_PATH = path.resolve('./test/e2e/mock-template-build')

function monkeyPatchInquirer(answers) {
  // monkey patch inquirer
  inquirer.prompt = (questions, cb) => {
    const key = questions[0].name
    const _answers = {}
    const validate = questions[0].validate
    const valid = validate(answers[key])
    if (valid !== true) {
      throw new Error(valid)
    }
    _answers[key] = answers[key]
    cb(_answers)
  };
}

describe('tomato-cli', () => {
  const answers = {
    name: 'tomato-cli-test',
    author: 'lynzz',
    version: '1.0.0',
    pick: 'no',
    description: 'tomato-cli e2e test'
  }

  it('template generation', done => {
    monkeyPatchInquirer(answers)
    generate('test', MOCK_TEMPLATE_REPO_PATH, MOCK_TEMPLATE_BUILD_PATH, err => {
      if (err) done(err)

      expect(exists(`${MOCK_TEMPLATE_BUILD_PATH}/src/index.js`)).to.equal(false)
      expect(exists(`${MOCK_TEMPLATE_BUILD_PATH}/src/hello.ftl`)).to.equal(true)
      expect(exists(`${MOCK_TEMPLATE_BUILD_PATH}/package.json`)).to.equal(true)

      async.eachSeries([
        'package.json',
        'src/hello.ftl'
      ], function (file, next) {
        const template = fs.readFileSync(`${MOCK_TEMPLATE_REPO_PATH}/template/${file}`, 'utf8')
        const generated = fs.readFileSync(`${MOCK_TEMPLATE_BUILD_PATH}/${file}`, 'utf8')

        render(template, answers, (err, res) => {
          if (err) return next(err)
          expect(res).to.equal(generated)
          next()
        })
      }, done)
    })
  })

  it('avoid rendering files that do not have handlebars', done => {
    monkeyPatchInquirer(answers)
    const binFilePath = `${MOCK_TEMPLATE_REPO_PATH}/template/bin.file`
    const wstream = fs.createWriteStream(binFilePath)
    wstream.write(crypto.randomBytes(100))
    wstream.end()

    generate('test', MOCK_TEMPLATE_REPO_PATH, MOCK_TEMPLATE_BUILD_PATH, err => {
      if (err) done(err)

      const handlebarsPackageJsonFile = fs.readFileSync(`${MOCK_TEMPLATE_REPO_PATH}/template/package.json`, 'utf8')
      const generatedPackageJsonFile = fs.readFileSync(`${MOCK_TEMPLATE_BUILD_PATH}/package.json`, 'utf8')

      render(handlebarsPackageJsonFile, answers, (err, res) => {
        if (err) return done(err)
        
        expect(res).to.equal(generatedPackageJsonFile)
        expect(exists(binFilePath)).to.equal(true)
        expect(exists(`${MOCK_TEMPLATE_BUILD_PATH}/bin.file`)).to.equal(true)
        rm(binFilePath)

        done()
      })
    })
  })

  it('validate input value', done => {
    // deep copy
    var invalidName = extend({}, answers, {name: 'INVALID-NAME'})
    monkeyPatchInquirer(invalidName)
    generate('INVALID-NAME', MOCK_TEMPLATE_REPO_PATH, MOCK_TEMPLATE_BUILD_PATH, err => {
      expect(err).to.be.an('error');
      done()
    })
  })
})
