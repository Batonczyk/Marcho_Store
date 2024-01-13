const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, the server is online!');
});

const trimReplace = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/\s+/g, ' ');
  }
  return input.trim();
};

const validateData = [
  body('name').customSanitizer(trimReplace).notEmpty().withMessage('Not data name, surname').isLength({ min: 2, max: 20 }).withMessage('The name should have at least 2 characters.'),
  body('phone').customSanitizer(trimReplace).notEmpty().withMessage('Not a number.').matches(/^[+]?\d{1,3}?[-. ]?\(?\d{1,3}?\)?[-. ]?\d{1,4}[-. ]?\d{1,4}$/).withMessage('The phone number is not correctly. Please try again.'),
  body('email').customSanitizer(trimReplace).notEmpty().withMessage('Not an email').isEmail().isLength({ min: 5, max: 100 }).withMessage('This email is not correctly.'),
  body('postid').customSanitizer(trimReplace).notEmpty().withMessage('Not a postid').matches(/^\d{2}(-\d{3})?$/).withMessage('The postid is not correctly'),
];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  authMethod: 'LOGIN'
});

app.post('/send-email', validateData, async (req, res) => {
  try {
    const orderData = req.body.order;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, surname, email, phone, postid, country, city, street, order } = req.body;
    console.log(req.body)
    const bodyOrder = JSON.parse(order);

    let productsHTML = '';
    for (let prod of bodyOrder) {
      console.log(prod.title);
      productsHTML += `
      <div>
      <img src="${prod.imgSrc}" alt="${prod.title}" style="max-width: 100px; height: 100px;">
      <p><strong>Product:</strong> ${prod.title}</p>
      <p><strong>Price:</strong> ${prod.price}</p>
      <p><strong>Quantity:</strong> ${prod.quantity}</p>
    </div>
      `
    }

    await transporter.sendMail({
      from: 'mwserwise@gmail.com',
      to: 'mwserwise@gmail.com',
      subject: `Email from ${name} ${surname} `,
      html: `
      <p><strong>Dear ${name} ${surname}, the order was correctly completed.
      Thank you for trusting us!</strong></p>
      <p>Your data:</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Street:</strong> ${street}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>PostId:</strong> ${postid}</p>
      <hr>
      <p><strong>Ordered Products: ${productsHTML}</strong></p>
      `,
    });

    res.send('Message is send!');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Server online on port ${PORT}`);
});

module.exports = {
  app,
  validateData,
};
console.log('PORT:', process.env.PORT);
console.log('EMAIL:', process.env.EMAIL);
console.log('PASS:', process.env.PASS);
