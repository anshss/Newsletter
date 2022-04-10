//jdhint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//-------------------Calling API

mailchimp.setConfig({
  apiKey: "b137bf99633f40b6c16ec896ca156eda-us14",
  server: "us14",
});

async function run() {
  const response = await mailchimp.ping.get();
  //   console.log(response);
}

run();

//-------------------

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  //-------------------Adding user to audience list

  const listId = "da90e60cc9";
  const subscribingUser = {
    firstName: fname,
    lastName: lname,
    email: email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    // console.log(
    //   `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    // );
  }

  run();

  //-------------------.checking status

  //   const listId = "YOUR_LIST_ID";
  //   const email = "prudence.mcvankab@example.com";
  const subscriberHash = md5(email.toLowerCase());

  async function run() {
    try {
      const response = await mailchimp.lists.getListMember(
        listId,
        subscriberHash
      );

      console.log(`This user's subscription status is ${response.status}.`);
    } catch (e) { 
      if (e.status === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  }
  run();

  //-------------------.
});


app.post('/failure', function(req, res) {
    res.redirect('/');
})


app.listen(process.env.PORT || 3000, function () {
  console.log("running on port 3000");
});

// api key
// b137bf99633f40b6c16ec896ca156eda-us14

// audience id
// da90e60cc9
