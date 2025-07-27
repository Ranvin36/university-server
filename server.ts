import express, { Request, Response } from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.get('/fitness/1/api', (req: Request, res: Response) => {  
    console.log('Received request for fitness API');
    return res.json({message:'Hello World'});
});


server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
