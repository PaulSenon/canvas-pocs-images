const express = require('express');
const app = express();
const port = 80;

app.use(express.static('public'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// app.get('/', (req, res) => res.send('Hello World!'))

// app.use('/static', express.static(path.join(__dirname, 'public')))