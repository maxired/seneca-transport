var log = function (err, out) {
  console.log(err, out)
}

require('seneca')()

  .add('foo:1,bar:A', function (args, done) {
    done(null, 'localA-' + args.bar)
  })

  .client({
    pin: {
      foo: 2,
      bar: '*'
    }
  })

  .add('foo:3,bar:C', function (args, done) {
    done(null, 'localC-' + args.bar)
  })

  .client({
    pin: {
      foo: 4,
      bar: '*'
    }
  })

  .add('foo:5,bar:E', function (args, done) {
    done(null, 'localE-' + args.bar)
  })

  .ready(function () {
    this.act('foo:1,bar:A', log)
    this.act('foo:2,bar:B', log)
    this.act('foo:3,bar:C', log)
    this.act('foo:4,bar:D', log)
    this.act('foo:5,bar:E', log)
    this.act('foo:1,bar:A', log)
    this.act('foo:2,bar:B', log)
    this.act('foo:3,bar:C', log)
    this.act('foo:4,bar:D', log)
    this.act('foo:5,bar:E', log)
    this.act('foo:1,bar:A', log)
    this.act('foo:2,bar:B', log)
    this.act('foo:3,bar:C', log)
    this.act('foo:4,bar:D', log)
    this.act('foo:5,bar:E', log)
  })
