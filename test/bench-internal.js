/* Copyright (c) 2014 Richard Rodger, MIT License */
'use strict'

var makeseneca = require('seneca')
var aa = function (args, done) {
  done(null, {
    aa: args.a
  })
}

var fr = Math.floor
function start_printer (ctxt) {
  console.log('rate', 'allrate', 'total', 'realrate', 'memusedpc', 'memtotal')
  setInterval(function () {
    ctxt.count++
    ctxt.seneca.act('role:seneca,stats:true', function (err, out) {
      if (err) { return console.log(err) }
      var stats = out.actmap['{a=1}']
      var mem = process.memoryUsage()
      console.log(stats.time.rate, fr(stats.time.allrate), ctxt.total, fr(ctxt.total / ctxt.count), (fr(100 * mem.heapUsed / mem.heapTotal)) / 100, fr(mem.heapTotal / (1024 * 1024)))
    })
  }, ctxt.interval)
}

var typemap = {}

typemap.internal = function () {
  makeseneca({
    log: 'silent',
    stats: {
      duration: 1000,
      size: 99998
    }
  })
    .add('a:1', aa)
    .ready(function () {
      var ctxt = {
        count: 0,
        total: 0,
        interval: 1000
      }
      ctxt.seneca = this

      start_printer(ctxt)

      function call () {
        ctxt.seneca.act('a:1')
        ctxt.total++
        setImmediate(call)
      }

      call()
    })
}

typemap.tcp = function () {
  makeseneca({
    log: 'silent',
    stats: {
      duration: 1000,
      size: 99998
    }
  })
    .add('a:1', aa)
    .listen({
      type: 'tcp'
    })
    .ready(function () {
      makeseneca({
        log: 'silent',
        stats: {
          duration: 1000,
          size: 99998
        }
      })
        .client({
          type: 'tcp'
        })
        .ready(function () {
          var ctxt = {
            count: 0,
            total: 0,
            interval: 1000
          }
          ctxt.seneca = this

          start_printer(ctxt)

          function call () {
            ctxt.seneca.act('a:1')
            ctxt.total++
            ctxt.total % 100 === 0 ? setImmediate(call) : call()
          }

          call()
        })
    })
}

typemap.web = function () {
  makeseneca({
    log: 'silent',
    stats: {
      duration: 1000,
      size: 99998
    }
  })
    .add('a:1', aa)
    .listen({
      type: 'web'
    })
    .ready(function () {
      makeseneca({
        log: 'silent',
        stats: {
          duration: 1000,
          size: 99998
        }
      })
        .client({
          type: 'web'
        })
        .ready(function () {
          var ctxt = {
            count: 0,
            total: 0,
            interval: 1000
          }
          ctxt.seneca = this

          start_printer(ctxt)

          function call () {
            ctxt.seneca.act('a:1')
            ctxt.total++
            setImmediate(call)
          }

          call()
        })
    })
}

typemap[process.argv[2]]()
