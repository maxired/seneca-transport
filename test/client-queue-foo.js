require('seneca')()
  .use('..')
  //.declare('foo')
  .proxy({type:'queue',pin:'foo:*'})
  .ready(function(){
    this.act('foo:1,bar:A',function(err,out){console.log(out)})
    this.act('foo:2,bar:B',function(err,out){console.log(out)})
  })
