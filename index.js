const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json({ limit: "10mb" }));

// GET must return 200 OK for Zoho validation
app.get('/', (req, res) => {
    res.status(200).send("Zoho webhook proxy running");
});

// POST forwards to Salesforce
app.post('/', async (req, res) => {
    console.log("Received from Zoho:", req.body);

    try {
        const sfResponse = await axios.post(
            'https://data-enterprise-7633-jinaprod.sandbox.my.site.com/services/apexrest/zoho/desk/webhook',
            req.body,
            { headers: { "Content-Type": "application/json" } }
        );

        res.status(200).json({ forwarded: true, status: sfResponse.status });

    } catch(err) {
        console.log("SF Error:", err.message);
        res.status(500).json({ forwarded: false, error: err.message });
    }
});

app.listen(3000, () => console.log("Proxy running on 3000"));
