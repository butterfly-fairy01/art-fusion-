const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = process.env.AZURE_API_KEY;

app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            \`\${AZURE_OPENAI_ENDPOINT}/openai/images/generations:submit?api-version=2023-06-01-preview\`,
            {
                prompt,
                n: 1,
                size: "1024x1024"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': AZURE_API_KEY
                }
            }
        );

        const operationLocation = response.headers['operation-location'];

        let imageUrl = null;
        let tries = 0;
        while (!imageUrl && tries < 10) {
            await new Promise(r => setTimeout(r, 2000));
            const statusResponse = await axios.get(operationLocation, {
                headers: { 'api-key': AZURE_API_KEY }
            });
            const data = statusResponse.data;
            if (data?.status === 'succeeded') {
                imageUrl = data.result.data[0].url;
            }
            tries++;
        }

        if (imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(500).json({ error: 'Image generation timed out' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.listen(port, () => {
    console.log(\`Server running on http://localhost:\${port}\`);
});
