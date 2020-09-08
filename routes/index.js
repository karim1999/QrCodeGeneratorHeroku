var express = require('express');
var router = express.Router();
const nodeHtmlToImage = require('node-html-to-image')
const path = require('path')
var QRCode = require('qrcode')
const fs = require('fs');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var GTIN = req.query.GTIN;
  var qrValue = req.query.data;
  var EXPIRY = req.query.EXPIRY;
  var BATCH = req.query.BATCH;
  var SN = req.query.SN;
  var dataURI= await QRCode.toDataURL(qrValue || "NaN")
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8')

  const image = await nodeHtmlToImage({
    html: html,
    content: { dataURI, GTIN, qrValue, EXPIRY, SN, BATCH },
    puppeteerArgs: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    }
  });
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image, 'binary');
});

module.exports = router;
