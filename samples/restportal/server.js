// REST portal Server
const env = require('./env');

const express    = require('express');
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');
const router = express.Router();

const port = process.env.PORT || env.restportal_port || 8080;        // set our port

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


// Apply Routes
router.get('/ping', function(req, res) {
    res.json('pong');
});


const micro = require('../../')({nats_url:'nats://localhost:4222'});

const delivery = (res) => {
  return (err, ans) => {
    if(err) res.send(err);
    else res.json(ans);
  };
};

router.get('/ping-config', (req, res) => {
  micro.act('get config ping', delivery(res));
});

/*require('../routes').forEach(route => {
  const rt = micro.express_app.route(route.route);

  // add get route
  if(route.get) {
    rt.get((req, res) => {
      micro.act({resource: route.get.resource || 'system', action: route.get.action}, delivery(res));
    });
  };

  // add post route
  if(route.post) {
    rt.post((req, res) => {
      const data = req.body;
      micro.act({resource: route.post.resource || 'system', action: route.post.action, data}, delivery(res));
    });
  };

});
*/
app.use('/', router);

micro.start(() => {
  app.server = app.listen(port);
  app.shutdownManager = new GracefulShutdownManager(app.server);
});

app.close = (fn) => {
  if(app.shutdownManager) {
    app.shutdownManager.terminate(() => {
      micro.close(fn);
    });
  }
};

process.on('SIGTERM', () => {
  app.close();
});

module.exports = app;
