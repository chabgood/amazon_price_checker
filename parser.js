require("dotenv").config();
const nightmare = require("nightmare")();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_SECRET);

const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

checkPrice();

async function checkPrice() {
  try {
    const priceString = await nightmare
      .goto(url)
      .wait("#priceblock_ourprice")
      .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
      .end();
    const priceNumber = parseFloat(priceString.replace("$", ""));
    if (priceNumber < minPrice) {
      await sendEmail(
        "The price is low",
        `The price dropped below ${minPrice}`
      );
    }
  } catch (error) {
    await sendEmail("Amazon Price Checker Error", error.message);
    throw error;
  }
}

function sendEmail(subject, body) {
  const email = {
    to: "fefafer639@4xmail.org",
    from: "amazon-process-checker@sgMail.com",
    subject: subject,
    text: body,
    html: body
  };
  return sgMail.send(email);
}
