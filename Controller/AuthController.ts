import { Request,Response } from "express";
import axios from 'axios';

const getToken = async (user:any,pass:any) => {
  const clientId = process.env.clientId!;
  const clientSecret = process.env.clientSecret!;
  const username = user;
  const password = pass;

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);
  params.append('scope', 'PRODUCTION');
  const response = await axios.post('https://localhost:9443/oauth2/token', params, {
    auth: {
      username: clientId,
      password: clientSecret,
    },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  return response.data.access_token;
};

export const loginUser = async(req:Request, res:Response) => {
  try{
        const {username, password} = req.body;
        console.log(username,password)
        const token = await getToken(username, password);
        res.json({ message: "Login endpoint is under construction" , token: token });
    }
    catch(error) {
        console.error('Error fetching token:', error);
        return res.status(500).json({ message: error});
    }
}