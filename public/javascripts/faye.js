if(!this.Faye)Faye={};Faye.extend=function(a,b,c){if(!b)return a;for(var d in b){if(!b.hasOwnProperty(d))continue;if(a.hasOwnProperty(d)&&c===false)continue;if(a[d]!==b[d])a[d]=b[d]}return a};Faye.extend(Faye,{VERSION:'0.6.2',BAYEUX_VERSION:'1.0',ID_LENGTH:128,JSONP_CALLBACK:'jsonpcallback',CONNECTION_TYPES:['long-polling','cross-origin-long-polling','callback-polling','websocket','in-process'],MANDATORY_CONNECTION_TYPES:['long-polling','callback-polling','in-process'],ENV:(function(){return this})(),random:function(a){a=a||this.ID_LENGTH;if(a>32){var b=Math.ceil(a/32),c='';while(b--)c+=this.random(32);return c}var d=Math.pow(2,a)-1,f=d.toString(36).length,c=Math.floor(Math.random()*d).toString(36);while(c.length<f)c='0'+c;return c},commonElement:function(a,b){for(var c=0,d=a.length;c<d;c++){if(this.indexOf(b,a[c])!==-1)return a[c]}return null},indexOf:function(a,b){for(var c=0,d=a.length;c<d;c++){if(a[c]===b)return c}return-1},each:function(a,b,c){if(a instanceof Array){for(var d=0,f=a.length;d<f;d++){if(a[d]!==undefined)b.call(c||null,a[d],d)}}else{for(var g in a){if(a.hasOwnProperty(g))b.call(c||null,g,a[g])}}},map:function(a,b,c){var d=[];this.each(a,function(){d.push(b.apply(c||null,arguments))});return d},filter:function(a,b,c){var d=[];this.each(a,function(){if(b.apply(c,arguments))d.push(arguments[0])});return d},size:function(a){var b=0;this.each(a,function(){b+=1});return b},enumEqual:function(c,d){if(d instanceof Array){if(!(c instanceof Array))return false;var f=c.length;if(f!==d.length)return false;while(f--){if(c[f]!==d[f])return false}return true}else{if(!(c instanceof Object))return false;if(this.size(d)!==this.size(c))return false;var g=true;this.each(c,function(a,b){g=g&&(d[a]===b)});return g}},asyncEach:function(a,b,c,d){var f=a.length,g=-1,h=0,i=false;var j=function(){h-=1;g+=1;if(g===f)return c&&c.call(d);b(a[g],m)};var k=function(){if(i)return;i=true;while(h>0)j();i=false};var m=function(){h+=1;k()};m()},toJSON:function(a){if(this.stringify)return this.stringify(a,function(key,value){return(this[key]instanceof Array)?this[key]:value});return JSON.stringify(a)},timestamp:function(){var b=new Date(),c=b.getFullYear(),d=b.getMonth()+1,f=b.getDate(),g=b.getHours(),h=b.getMinutes(),i=b.getSeconds();var j=function(a){return a<10?'0'+a:String(a)};return j(c)+'-'+j(d)+'-'+j(f)+' '+j(g)+':'+j(h)+':'+j(i)}});Faye.Class=function(a,b){if(typeof a!=='function'){b=a;a=Object}var c=function(){if(!this.initialize)return this;return this.initialize.apply(this,arguments)||this};var d=function(){};d.prototype=a.prototype;c.prototype=new d();Faye.extend(c.prototype,b);return c};Faye.Namespace=Faye.Class({initialize:function(){this._c={}},exists:function(a){return this._c.hasOwnProperty(a)},generate:function(){var a=Faye.random();while(this._c.hasOwnProperty(a))a=Faye.random();return this._c[a]=a},release:function(a){delete this._c[a]}});Faye.Error=Faye.Class({initialize:function(a,b,c){this.code=a;this.params=Array.prototype.slice.call(b);this.message=c},toString:function(){return this.code+':'+this.params.join(',')+':'+this.message}});Faye.Error.parse=function(a){a=a||'';if(!Faye.Grammar.ERROR.test(a))return new this(null,[],a);var b=a.split(':'),c=parseInt(b[0]),d=b[1].split(','),a=b[2];return new this(c,d,a)};Faye.Error.versionMismatch=function(){return new this(300,arguments,"Version mismatch").toString()};Faye.Error.conntypeMismatch=function(){return new this(301,arguments,"Connection types not supported").toString()};Faye.Error.extMismatch=function(){return new this(302,arguments,"Extension mismatch").toString()};Faye.Error.badRequest=function(){return new this(400,arguments,"Bad request").toString()};Faye.Error.clientUnknown=function(){return new this(401,arguments,"Unknown client").toString()};Faye.Error.parameterMissing=function(){return new this(402,arguments,"Missing required parameter").toString()};Faye.Error.channelForbidden=function(){return new this(403,arguments,"Forbidden channel").toString()};Faye.Error.channelUnknown=function(){return new this(404,arguments,"Unknown channel").toString()};Faye.Error.channelInvalid=function(){return new this(405,arguments,"Invalid channel").toString()};Faye.Error.extUnknown=function(){return new this(406,arguments,"Unknown extension").toString()};Faye.Error.publishFailed=function(){return new this(407,arguments,"Failed to publish").toString()};Faye.Error.serverError=function(){return new this(500,arguments,"Internal server error").toString()};Faye.Deferrable={callback:function(a,b){if(!a)return;if(this._s==='succeeded')return a.apply(b,this._i);this._j=this._j||[];this._j.push([a,b])},errback:function(a,b){if(!a)return;if(this._s==='failed')return a.apply(b,this._i);this._k=this._k||[];this._k.push([a,b])},setDeferredStatus:function(){var a=Array.prototype.slice.call(arguments),b=a.shift(),c;this._s=b;this._i=a;if(b==='succeeded')c=this._j;else if(b==='failed')c=this._k;if(!c)return;var d;while(d=c.shift())d[0].apply(d[1],this._i)}};Faye.Publisher={countSubscribers:function(a){if(!this._3||!this._3[a])return 0;return this._3[a].length},addSubscriber:function(a,b,c){this._3=this._3||{};var d=this._3[a]=this._3[a]||[];d.push([b,c])},removeSubscriber:function(a,b,c){if(!this._3||!this._3[a])return;if(!b){delete this._3[a];return}var d=this._3[a],f=d.length;while(f--){if(b!==d[f][0])continue;if(c&&d[f][1]!==c)continue;d.splice(f,1)}},removeSubscribers:function(){this._3={}},publishEvent:function(){var b=Array.prototype.slice.call(arguments),c=b.shift();if(!this._3||!this._3[c])return;Faye.each(this._3[c],function(a){a[0].apply(a[1],b)})}};Faye.Timeouts={addTimeout:function(a,b,c,d){this._4=this._4||{};if(this._4.hasOwnProperty(a))return;var f=this;this._4[a]=Faye.ENV.setTimeout(function(){delete f._4[a];c.call(d)},1000*b)},removeTimeout:function(a){this._4=this._4||{};var b=this._4[a];if(!b)return;clearTimeout(b);delete this._4[a]}};Faye.Logging={LOG_LEVELS:{error:3,warn:2,info:1,debug:0},logLevel:'error',log:function(a,b){if(!Faye.logger)return;var c=Faye.Logging.LOG_LEVELS;if(c[Faye.Logging.logLevel]>c[b])return;var a=Array.prototype.slice.apply(a),d=' ['+b.toUpperCase()+'] [Faye',f=this.className,g=a.shift().replace(/\?/g,function(){try{return Faye.toJSON(a.shift())}catch(e){return'[Object]'}});for(var h in Faye){if(f)continue;if(typeof Faye[h]!=='function')continue;if(this instanceof Faye[h])f=h}if(f)d+='.'+f;d+='] ';Faye.logger(Faye.timestamp()+d+g)}};Faye.each(Faye.Logging.LOG_LEVELS,function(a,b){Faye.Logging[a]=function(){this.log(arguments,a)}});Faye.Grammar={LOWALPHA:/^[a-z]$/,UPALPHA:/^[A-Z]$/,ALPHA:/^([a-z]|[A-Z])$/,DIGIT:/^[0-9]$/,ALPHANUM:/^(([a-z]|[A-Z])|[0-9])$/,MARK:/^(\-|\_|\!|\~|\(|\)|\$|\@)$/,STRING:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*$/,TOKEN:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+$/,INTEGER:/^([0-9])+$/,CHANNEL_SEGMENT:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+$/,CHANNEL_SEGMENTS:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,CHANNEL_NAME:/^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,WILD_CARD:/^\*{1,2}$/,CHANNEL_PATTERN:/^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,VERSION_ELEMENT:/^(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*$/,VERSION:/^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/,CLIENT_ID:/^((([a-z]|[A-Z])|[0-9]))+$/,ID:/^((([a-z]|[A-Z])|[0-9]))+$/,ERROR_MESSAGE:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*$/,ERROR_ARGS:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*$/,ERROR_CODE:/^[0-9][0-9][0-9]$/,ERROR:/^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/};Faye.Extensible={addExtension:function(a){this._5=this._5||[];this._5.push(a);if(a.added)a.added()},removeExtension:function(a){if(!this._5)return;var b=this._5.length;while(b--){if(this._5[b]!==a)continue;this._5.splice(b,1);if(a.removed)a.removed()}},pipeThroughExtensions:function(c,d,f,g){this.debug('Passing through ? extensions: ?',c,d);if(!this._5)return f.call(g,d);var h=this._5.slice();var i=function(a){if(!a)return f.call(g,a);var b=h.shift();if(!b)return f.call(g,a);if(b[c])b[c](a,i);else i(a)};i(d)}};Faye.extend(Faye.Extensible,Faye.Logging);Faye.Channel=Faye.Class({initialize:function(a){this.id=this.name=a},push:function(a){this.publishEvent('message',a)},isUnused:function(){return this.countSubscribers('message')===0}});Faye.extend(Faye.Channel.prototype,Faye.Publisher);Faye.extend(Faye.Channel,{HANDSHAKE:'/meta/handshake',CONNECT:'/meta/connect',SUBSCRIBE:'/meta/subscribe',UNSUBSCRIBE:'/meta/unsubscribe',DISCONNECT:'/meta/disconnect',META:'meta',SERVICE:'service',expand:function(a){var b=this.parse(a),c=['/**',a];var d=b.slice();d[d.length-1]='*';c.push(this.unparse(d));for(var f=1,g=b.length;f<g;f++){d=b.slice(0,f);d.push('**');c.push(this.unparse(d))}return c},isValid:function(a){return Faye.Grammar.CHANNEL_NAME.test(a)||Faye.Grammar.CHANNEL_PATTERN.test(a)},parse:function(a){if(!this.isValid(a))return null;return a.split('/').slice(1)},unparse:function(a){return'/'+a.join('/')},isMeta:function(a){var b=this.parse(a);return b?(b[0]===this.META):null},isService:function(a){var b=this.parse(a);return b?(b[0]===this.SERVICE):null},isSubscribable:function(a){if(!this.isValid(a))return null;return!this.isMeta(a)&&!this.isService(a)},Set:Faye.Class({initialize:function(){this._2={}},getKeys:function(){var c=[];Faye.each(this._2,function(a,b){c.push(a)});return c},remove:function(a){delete this._2[a]},hasSubscription:function(a){return this._2.hasOwnProperty(a)},subscribe:function(c,d,f){if(!d)return;Faye.each(c,function(a){var b=this._2[a]=this._2[a]||new Faye.Channel(a);b.addSubscriber('message',d,f)},this)},unsubscribe:function(a,b,c){var d=this._2[a];if(!d)return false;d.removeSubscriber('message',b,c);if(d.isUnused()){this.remove(a);return true}else{return false}},distributeMessage:function(c){var d=Faye.Channel.expand(c.channel);Faye.each(d,function(a){var b=this._2[a];if(b)b.publishEvent('message',c.data)},this)}})});Faye.Subscription=Faye.Class({initialize:function(a,b,c,d){this._8=a;this._2=b;this._l=c;this._m=d;this._t=false},cancel:function(){if(this._t)return;this._8.unsubscribe(this._2,this._l,this._m);this._t=true},unsubscribe:function(){this.cancel()}});Faye.extend(Faye.Subscription.prototype,Faye.Deferrable);Faye.Client=Faye.Class({UNCONNECTED:1,CONNECTING:2,CONNECTED:3,DISCONNECTED:4,HANDSHAKE:'handshake',RETRY:'retry',NONE:'none',CONNECTION_TIMEOUT:60.0,DEFAULT_ENDPOINT:'/bayeux',INTERVAL:0.0,initialize:function(b,c){this.info('New client created for ?',b);this.endpoint=b||this.DEFAULT_ENDPOINT;this._u=c||{};Faye.Transport.get(this,Faye.MANDATORY_CONNECTION_TYPES,function(a){this._d=a},this);this._1=this.UNCONNECTED;this._2=new Faye.Channel.Set();this._y=new Faye.Namespace();this._n={};this._6={reconnect:this.RETRY,interval:1000*(this._u.interval||this.INTERVAL),timeout:1000*(this._u.timeout||this.CONNECTION_TIMEOUT)};if(Faye.Event)Faye.Event.on(Faye.ENV,'beforeunload',this.disconnect,this)},getClientId:function(){return this._0},getState:function(){switch(this._1){case this.UNCONNECTED:return'UNCONNECTED';case this.CONNECTING:return'CONNECTING';case this.CONNECTED:return'CONNECTED';case this.DISCONNECTED:return'DISCONNECTED'}},handshake:function(c,d){if(this._6.reconnect===this.NONE)return;if(this._1!==this.UNCONNECTED)return;this._1=this.CONNECTING;var f=this;this.info('Initiating handshake with ?',this.endpoint);this._9({channel:Faye.Channel.HANDSHAKE,version:Faye.BAYEUX_VERSION,supportedConnectionTypes:[this._d.connectionType]},function(b){if(b.successful){this._1=this.CONNECTED;this._0=b.clientId;Faye.Transport.get(this,b.supportedConnectionTypes,function(a){this._d=a},this);this.info('Handshake successful: ?',this._0);this.subscribe(this._2.getKeys(),true);if(c)c.call(d)}else{this.info('Handshake unsuccessful');Faye.ENV.setTimeout(function(){f.handshake(c,d)},this._6.interval);this._1=this.UNCONNECTED}},this)},connect:function(a,b){if(this._6.reconnect===this.NONE)return;if(this._1===this.DISCONNECTED)return;if(this._1===this.UNCONNECTED)return this.handshake(function(){this.connect(a,b)},this);this.callback(a,b);if(this._1!==this.CONNECTED)return;this.info('Calling deferred actions for ?',this._0);this.setDeferredStatus('succeeded');this.setDeferredStatus('deferred');if(this._o)return;this._o=true;this.info('Initiating connection for ?',this._0);this._9({channel:Faye.Channel.CONNECT,clientId:this._0,connectionType:this._d.connectionType},this._v,this)},disconnect:function(){if(this._1!==this.CONNECTED)return;this._1=this.DISCONNECTED;this.info('Disconnecting ?',this._0);this._9({channel:Faye.Channel.DISCONNECT,clientId:this._0});this.info('Clearing channel listeners for ?',this._0);this._2=new Faye.Channel.Set()},subscribe:function(c,d,f){if(c instanceof Array)return Faye.each(c,function(channel){this.subscribe(channel,d,f)},this);var g=new Faye.Subscription(this,c,d,f);var h=(d===true);if(!h&&this._2.hasSubscription(c)){this._2.subscribe([c],d,f);g.setDeferredStatus('succeeded');return g}this.connect(function(){this.info('Client ? attempting to subscribe to ?',this._0,c);this._9({channel:Faye.Channel.SUBSCRIBE,clientId:this._0,subscription:c},function(a){if(!a.successful)return g.setDeferredStatus('failed',Faye.Error.parse(a.error));var b=[].concat(a.subscription);this.info('Subscription acknowledged for ? to ?',this._0,b);this._2.subscribe(b,d,f);g.setDeferredStatus('succeeded')},this)},this);return g},unsubscribe:function(c,d,f){if(c instanceof Array)return Faye.each(c,function(channel){this.unsubscribe(channel,d,f)},this);var g=this._2.unsubscribe(c,d,f);if(!g)return;this.connect(function(){this.info('Client ? attempting to unsubscribe from ?',this._0,c);this._9({channel:Faye.Channel.UNSUBSCRIBE,clientId:this._0,subscription:c},function(a){if(!a.successful)return;var b=[].concat(a.subscription);this.info('Unsubscription acknowledged for ? from ?',this._0,b)},this)},this)},publish:function(a,b){if(!Faye.Grammar.CHANNEL_NAME.test(a))throw new Error("Cannot publish: '"+a+"' is not a valid channel name");this.connect(function(){this.info('Client ? queueing published message to ?: ?',this._0,a,b);this._9({channel:a,data:b,clientId:this._0})},this)},receiveMessage:function(c){this.pipeThroughExtensions('incoming',c,function(a){if(!a)return;if(a.advice)this._z(a.advice);var b=this._n[a.id];if(b){delete this._n[a.id];b[0].call(b[1],a)}this._A(a)},this)},_9:function(b,c,d){b.id=this._y.generate();if(c)this._n[b.id]=[c,d];this.pipeThroughExtensions('outgoing',b,function(a){if(!a)return;this._d.send(a,this._6.timeout/1000)},this)},_z:function(a){Faye.extend(this._6,a);if(this._6.reconnect===this.HANDSHAKE&&this._1!==this.DISCONNECTED){this._1=this.UNCONNECTED;this._0=null;this._v()}},_A:function(a){if(!a.channel||!a.data)return;this.info('Client ? calling listeners for ? with ?',this._0,a.channel,a.data);this._2.distributeMessage(a)},_B:function(){if(!this._o)return;this._o=null;this.info('Closed connection for ?',this._0)},_v:function(){this._B();var a=this;Faye.ENV.setTimeout(function(){a.connect()},this._6.interval)}});Faye.extend(Faye.Client.prototype,Faye.Deferrable);Faye.extend(Faye.Client.prototype,Faye.Logging);Faye.extend(Faye.Client.prototype,Faye.Extensible);Faye.Transport=Faye.extend(Faye.Class({MAX_DELAY:0.0,batching:true,initialize:function(a,b){this.debug('Created new ? transport for ?',this.connectionType,b);this._8=a;this._a=b;this._e=[]},send:function(a,b){this.debug('Client ? sending message to ?: ?',this._8._0,this._a,a);if(!this.batching)return this.request([a],b);this._e.push(a);this._7=b;if(a.channel===Faye.Channel.HANDSHAKE)return this.flush();if(a.channel===Faye.Channel.CONNECT)this._p=a;this.addTimeout('publish',this.MAX_DELAY,this.flush,this)},flush:function(){this.removeTimeout('publish');if(this._e.length>1&&this._p)this._p.advice={timeout:0};this.request(this._e,this._7);this._p=null;this._e=[]},receive:function(a){this.debug('Client ? received from ?: ?',this._8._0,this._a,a);Faye.each(a,this._8.receiveMessage,this._8)},retry:function(a,b){var c=this;return function(){Faye.ENV.setTimeout(function(){c.request(a,2*b)},1000*b)}}}),{get:function(g,h,i,j){var k=g.endpoint;if(h===undefined)h=this.supportedConnectionTypes();Faye.asyncEach(this._q,function(b,c){var d=b[0],f=b[1];if(Faye.indexOf(h,d)<0)return c();f.isUsable(k,function(a){if(a)i.call(j,new f(g,k));else c()})},function(){throw new Error('Could not find a usable connection type for '+k);})},register:function(a,b){this._q.push([a,b]);b.prototype.connectionType=a},_q:[],supportedConnectionTypes:function(){return Faye.map(this._q,function(a){return a[0]})}});Faye.extend(Faye.Transport.prototype,Faye.Logging);Faye.extend(Faye.Transport.prototype,Faye.Timeouts);Faye.Event={_f:[],on:function(a,b,c,d){var f=function(){c.call(d)};if(a.addEventListener)a.addEventListener(b,f,false);else a.attachEvent('on'+b,f);this._f.push({_g:a,_r:b,_l:c,_m:d,_w:f})},detach:function(a,b,c,d){var f=this._f.length,g;while(f--){g=this._f[f];if((a&&a!==g._g)||(b&&b!==g._r)||(c&&c!==g._l)||(d&&d!==g._m))continue;if(g._g.removeEventListener)g._g.removeEventListener(g._r,g._w,false);else g._g.detachEvent('on'+g._r,g._w);this._f.splice(f,1);g=null}}};Faye.Event.on(Faye.ENV,'unload',Faye.Event.detach,Faye.Event);Faye.URI=Faye.extend(Faye.Class({queryString:function(){var c=[],d;Faye.each(this.params,function(a,b){c.push(encodeURIComponent(a)+'='+encodeURIComponent(b))});return c.join('&')},isLocal:function(){var a=Faye.URI.parse(Faye.ENV.location.href);var b=(a.hostname!==this.hostname)||(a.port!==this.port)||(a.protocol!==this.protocol);return!b},toURL:function(){var a=this.queryString();return this.protocol+this.hostname+':'+this.port+this.pathname+(a?'?'+a:'')}}),{parse:function(d,f){if(typeof d!=='string')return d;var g=new this();var h=function(b,c){d=d.replace(c,function(a){if(a)g[b]=a;return''})};h('protocol',/^https?\:\/+/);h('hostname',/^[^\/\:]+/);h('port',/^:[0-9]+/);Faye.extend(g,{protocol:'http://',hostname:Faye.ENV.location.hostname,port:Faye.ENV.location.port},false);if(!g.port)g.port=(g.protocol==='https://')?'443':'80';g.port=g.port.replace(/\D/g,'');var i=d.split('?'),j=i.shift(),k=i.join('?'),m=k?k.split('&'):[],o=m.length,l={};while(o--){i=m[o].split('=');l[decodeURIComponent(i[0]||'')]=decodeURIComponent(i[1]||'')}if(typeof f==='object')Faye.extend(l,f);g.pathname=j;g.params=l;return g}});if(!this.JSON){JSON={}}(function(){function k(a){return a<10?'0'+a:a}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(a){return this.getUTCFullYear()+'-'+k(this.getUTCMonth()+1)+'-'+k(this.getUTCDate())+'T'+k(this.getUTCHours())+':'+k(this.getUTCMinutes())+':'+k(this.getUTCSeconds())+'Z'};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()}}var m=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,l,p,s={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},n;function r(c){o.lastIndex=0;return o.test(c)?'"'+c.replace(o,function(a){var b=s[a];return typeof b==='string'?b:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+c+'"'}function q(a,b){var c,d,f,g,h=l,i,j=b[a];if(j&&typeof j==='object'&&typeof j.toJSON==='function'){j=j.toJSON(a)}if(typeof n==='function'){j=n.call(b,a,j)}switch(typeof j){case'string':return r(j);case'number':return isFinite(j)?String(j):'null';case'boolean':case'null':return String(j);case'object':if(!j){return'null'}l+=p;i=[];if(Object.prototype.toString.apply(j)==='[object Array]'){g=j.length;for(c=0;c<g;c+=1){i[c]=q(c,j)||'null'}f=i.length===0?'[]':l?'[\n'+l+i.join(',\n'+l)+'\n'+h+']':'['+i.join(',')+']';l=h;return f}if(n&&typeof n==='object'){g=n.length;for(c=0;c<g;c+=1){d=n[c];if(typeof d==='string'){f=q(d,j);if(f){i.push(r(d)+(l?': ':':')+f)}}}}else{for(d in j){if(Object.hasOwnProperty.call(j,d)){f=q(d,j);if(f){i.push(r(d)+(l?': ':':')+f)}}}}f=i.length===0?'{}':l?'{\n'+l+i.join(',\n'+l)+'\n'+h+'}':'{'+i.join(',')+'}';l=h;return f}}Faye.stringify=function(a,b,c){var d;l='';p='';if(typeof c==='number'){for(d=0;d<c;d+=1){p+=' '}}else if(typeof c==='string'){p=c}n=b;if(b&&typeof b!=='function'&&(typeof b!=='object'||typeof b.length!=='number')){throw new Error('JSON.stringify');}return q('',{'':a})};if(typeof JSON.stringify!=='function'){JSON.stringify=Faye.stringify}if(typeof JSON.parse!=='function'){JSON.parse=function(g,h){var i;function j(a,b){var c,d,f=a[b];if(f&&typeof f==='object'){for(c in f){if(Object.hasOwnProperty.call(f,c)){d=j(f,c);if(d!==undefined){f[c]=d}else{delete f[c]}}}}return h.call(a,b,f)}m.lastIndex=0;if(m.test(g)){g=g.replace(m,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(g.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){i=eval('('+g+')');return typeof h==='function'?j({'':i},''):i}throw new SyntaxError('JSON.parse');}}}());Faye.Transport.WebSocket=Faye.extend(Faye.Class(Faye.Transport,{UNCONNECTED:1,CONNECTING:2,CONNECTED:3,batching:false,request:function(b,c){this._7=this._7||c;this._h=this._h||{};Faye.each(b,function(a){this._h[a.id]=a},this);this.withSocket(function(a){a.send(Faye.toJSON(b))})},withSocket:function(a,b){this.callback(a,b);this.connect()},connect:function(){this._1=this._1||this.UNCONNECTED;if(this._1!==this.UNCONNECTED)return;this._1=this.CONNECTING;this._b=new WebSocket(Faye.Transport.WebSocket.getSocketUrl(this._a));var d=this;this._b.onopen=function(){delete d._7;d._1=d.CONNECTED;d.setDeferredStatus('succeeded',d._b)};this._b.onmessage=function(b){var c=[].concat(JSON.parse(b.data));Faye.each(c,function(a){delete d._h[a.id]});d.receive(c)};this._b.onclose=function(){var a=(d._1===d.CONNECTED);d.setDeferredStatus('deferred');d._1=d.UNCONNECTED;delete d._b;if(a)return d.resend();Faye.ENV.setTimeout(function(){d.connect()},1000*d._7);d._7=d._7*2}},resend:function(){var c=Faye.map(this._h,function(a,b){return b});this.request(c)}}),{WEBSOCKET_TIMEOUT:1000,getSocketUrl:function(a){return Faye.URI.parse(a).toURL().replace(/^http(s?):/ig,'ws$1:')},isUsable:function(a,b,c){if(!Faye.ENV.WebSocket)return b.call(c,false);var d=false,f=false,g=this.getSocketUrl(a),h=new WebSocket(g);h.onopen=function(){d=true;h.close();b.call(c,true);f=true;h=null};var i=function(){if(!f&&!d)b.call(c,false);f=true};h.onclose=h.onerror=i;Faye.ENV.setTimeout(i,this.WEBSOCKET_TIMEOUT)}});Faye.extend(Faye.Transport.WebSocket.prototype,Faye.Deferrable);Faye.Transport.register('websocket',Faye.Transport.WebSocket);Faye.Transport.XHR=Faye.extend(Faye.Class(Faye.Transport,{request:function(b,c){var d=this.retry(b,c),f=Faye.URI.parse(this._a).pathname,g=this,h=Faye.ENV.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();h.open('POST',f,true);h.setRequestHeader('Content-Type','application/json');h.setRequestHeader('X-Requested-With','XMLHttpRequest');h.onreadystatechange=function(){if(h.readyState!==4)return;var a=h.status;try{if((a>=200&&a<300)||a===304||a===1223)g.receive(JSON.parse(h.responseText));else d()}catch(e){d()}finally{Faye.Event.detach(Faye.ENV,'beforeunload',i);h.onreadystatechange=function(){};h=null}};var i=function(){h.abort()};Faye.Event.on(Faye.ENV,'beforeunload',i);h.send(Faye.toJSON(b))}}),{isUsable:function(a,b,c){b.call(c,Faye.URI.parse(a).isLocal())}});Faye.Transport.register('long-polling',Faye.Transport.XHR);Faye.Transport.CORS=Faye.extend(Faye.Class(Faye.Transport,{request:function(a,b){var c=Faye.ENV.XDomainRequest?XDomainRequest:XMLHttpRequest,d=new c(),f=this.retry(a,b),g=this;d.open('POST',this._a,true);d.onload=function(){try{g.receive(JSON.parse(d.responseText))}catch(e){f()}finally{d.onload=d.onerror=null;d=null}};d.onerror=f;d.onprogress=function(){};d.send('message='+encodeURIComponent(Faye.toJSON(a)))}}),{isUsable:function(a,b,c){if(Faye.URI.parse(a).isLocal())return b.call(c,false);if(Faye.ENV.XDomainRequest)return b.call(c,true);if(Faye.ENV.XMLHttpRequest){var d=new Faye.ENV.XMLHttpRequest();return b.call(c,d.withCredentials!==undefined)}return b.call(c,false)}});Faye.Transport.register('cross-origin-long-polling',Faye.Transport.CORS);Faye.Transport.JSONP=Faye.extend(Faye.Class(Faye.Transport,{request:function(b,c){var d={message:Faye.toJSON(b)},f=document.getElementsByTagName('head')[0],g=document.createElement('script'),h=Faye.Transport.JSONP.getCallbackName(),i=Faye.URI.parse(this._a,d),j=this;var k=function(){if(!g.parentNode)return false;g.parentNode.removeChild(g);return true};Faye.ENV[h]=function(a){Faye.ENV[h]=undefined;try{delete Faye.ENV[h]}catch(e){}if(!k())return;j.receive(a)};Faye.ENV.setTimeout(function(){if(!Faye.ENV[h])return;k();j.request(b,2*c)},1000*c);i.params.jsonp=h;g.type='text/javascript';g.src=i.toURL();f.appendChild(g)}}),{_x:0,getCallbackName:function(){this._x+=1;return'__jsonp'+this._x+'__'},isUsable:function(a,b,c){b.call(c,true)}});Faye.Transport.register('callback-polling',Faye.Transport.JSONP);