const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const app = express();
app.use(bodyParser.json());


app.use( (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST');
		return res.status(200).json({});
	}
	next();
});

const urls = {
  stk: '',
  simulate: '',
  b2c: '',
  base_url: '',
};
const maker = access_token();
const headers = {
  Authorization: 'Bearer ' + maker,
};

app.get('/', (req, res) => {
  let date = new Date();
  let timestamp =
    date.getDate() +
    '' +
    '' +
    date.getMonth() +
    '' +
    '' +
    date.getFullYear() +
    '' +
    '' +
    date.getHours() +
    '' +
    '' +
    date.getMinutes() +
    '' +
    '' +
    date.getSeconds();

  res.status(200).json({
    message: "We're up and running. Happy Coding",
    time: new Buffer.from(timestamp).toString('base64'),
    token: headers,
  });
});

app.get('/access_token', access, (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});

app.get('/register', access, (req, resp) => {
  let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
  let auth = 'Bearer ' + req.access_token;
  console.log(auth);

  request(
    {
      url: url,
      method: 'POST',
      headers: {
        Authorization: auth,
      },
      json: {
        ShortCode: '600779',
        ResponseType: 'Complete',
        ConfirmationURL: 'https://forvandc.herokuapp.com/confirmation',
        ValidationURL: 'https://forvandc.herokuapp.com/validation',
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      }
      resp.status(200).json(body);
    }
  );
});

app.post('/confirmation', (req, res) => {
  console.log('....................... confirmation .............');
  res.status(200).json({
    ResultCode: 0,
    ResultDesc: 'confirmation Service processing successful',
  });
  console.log(req.body);
});

app.post('/validation', (req, resp) => {
  console.log('....................... validation .............');
  res.status(200).json({
    ResultCode: 0,
    ResultDesc: 'validation Service processing successful',
  });
  console.log(req.body);
});

app.get('/simulate', access, (req, res) => {
  let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate';
  let auth = 'Bearer ' + req.access_token;

  request(
    {
      url: url,
      method: 'POST',
      headers: {
        Authorization: auth,
      },
      json: {
        ShortCode: '600779',
        CommandID: 'CustomerPayBillOnline',
        Amount: '100',
        Msisdn: '254708374149',
        BillRefNumber: 'TestAPI',
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

function access(req, res, next) {
  // access token
  let url =
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  let auth = new Buffer.from(
    '4ZVBYFkadSThTC3FKwP2ksI7gPr5xjuA:i05W9As9bu6IjpqB'
  ).toString('base64');

  request(
    {
      url: url,
      headers: {
        Authorization: 'Basic ' + auth,
      },
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        // let resp =
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
}

function access_token() {
  // access token
  let url =
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  let auth = new Buffer.from(
    '4ZVBYFkadSThTC3FKwP2ksI7gPr5xjuA:i05W9As9bu6IjpqB'
  ).toString('base64');

  request(
    {
      url: url,
      headers: {
        Authorization: 'Basic ' + auth,
      },
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        // let resp =
        console.log(JSON.parse(body).access_token.toString());
        return JSON.parse(body).access_token.toString();
      }
    }
  );
}

// const Mpesa = require('mpesa-api').Mpesa;

// const credentials = {
//   initiator_password: 'Safcom779!',
//   security_credential:
//     'pQybw0njZz18YhhGLbkgHffkR9X6PIIyHsYrbBnVWTURxoxswtTOA8+Jpt3q+AcwM4IjERoaeSur86QscxprAwUVbdZrUQtLV840LXk846LO5U8Qm6YZPwumfsDpB5Jd+R/TENMJ0Dvk0Y+Mgxlg4DrWRAqtPjZjSFHLlJ6FkWjSyBKBI3s6ZtKFcvz/5T6r4uf667nIbGg7VCa/LpWbwCjHnEezxrSGEVFTR2pyEX111s/7XTMontGVuok0MevRWqcpfcBOlK3eUS3mZ1tFd2h6/Hq6nr/IyHExdjeEBzIjx5v9jx4sywiylXvMdVpxOuYSA0xbOWEOn0z41kytPg==',
//   certificatepath: null,
//   client_key: '4ZVBYFkadSThTC3FKwP2ksI7gPr5xjuA',
//   client_secret: 'i05W9As9bu6IjpqB',
// };

// const environment = 'sandbox';
// // create a new instance of the api
// const mpesa = new Mpesa(credentials, environment);

// mpesa
//   .c2bregister({
//     ShortCode: 600779,
//     ConfirmationURL: 'https://en4vn6ucb15p.x.pipedream.net/',
//     ValidationURL: 'https://en0mxvxwswiwza.x.pipedream.net/',
//     ResponseType: 'Response Type',
//   })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     //Do something with the error;
//     //eg
//     console.error(error);
//   });

// mpesa
//   .c2bsimulate({
//     ShortCode: 600779,
//     Amount: 1000 /* 1000 is an example amount */,
//     Msisdn: 254708374149,
//     CommandID: 'CustomerPayBillOnline' /* OPTIONAL */,
//     BillRefNumber: 'TestAPI' /* OPTIONAL */,
//   })
//   .then((response) => {
//     //Do something with the response
//     //eg
//     console.log('simulate', response);
//   })
//   .catch((error) => {
//     //Do something with the error;
//     //eg
//     console.error(error);
//   });
app.listen(port, () => {
  console.log(`server running on the ${port}`);
});
