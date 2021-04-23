var express = require('express');



var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
var app = express();

app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use(express.json());
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    
    res.render('detail', req.query);
    
});

app.post('/payment', (req, res) => {
  console.log('Payment: ->')
  console.log(req.body);
  res.status(200).end();
})

app.get('/success', (req, res) => {
  console.log('request query: ', req.query);
  res.render('success', req.query);
})

app.get('/pending', (req, res) => {
  console.log('request query: ', req.query);
  res.render('pending', req.query);
})

app.get('/failure', (req, res) => {
  console.log('request query: ', req.query);
  res.render('failure', req.query);
})

app.post('/checkout', (req, res) => {
  
    let preference = {
        headers: {
          "x-integrator-id": "dev_24c65fb163bf11ea96500242ac130004" 
        },
        items: [
          {
          ID: 1234,
          title: req.body.title,
          description: "Dispositivo Móvil de Tienda e-commerce",
          image: __dirname + req.body.img,
          quantity: 1,
          unit_price: Number(req.body.price),
          external_reference: "curasantiago@gmail.com"
        }
      ],
        payer: {
          first_name: "Lalo",
          last_name: "Landa",
          phone: {
            area_code: "11",
            number: 22223333
          },
          address: {
            street_name: "false",
            street_number: 123,
            zip_code: "1111"
          },
        },
        payment_methods: {
          excluded_payment_methods: [
            {
              id: "amex"
            }
          ],
          excluded_payment_types: [
            {
              id: "atm"
            }
          ],
          installments: 6
        },
        back_urls: {
          success: "https://santiagocura-mp-ecommerce-node.herokuapp.com/success",
          failure: "https://santiagocura-mp-ecommerce-node.herokuapp.com/failure",
          pending: "https://santiagocura-mp-ecommerce-node.herokuapp.com/pending"
      },
      auto_return: "approved",

        notification_url: 'https://santiagocura-mp-ecommerce-node.herokuapp.com/payment',
        external_reference: 'curasantiago@gmail.com',
        };
     
      mercadopago.preferences.create(preference)
      .then(function(response){
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        global.id = response.body.id;
       
        
        res.redirect(response.body.init_point);


      }).catch(function(error){
        console.log(error);
      });
})


app.listen(port);

// SDK de Mercado Pago
const mercadopago = require ('mercadopago');
// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

