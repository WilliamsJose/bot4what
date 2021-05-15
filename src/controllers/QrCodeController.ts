import {Request, Response} from 'express';
import path from 'path';

export default {
  async index(req: Request, res: Response) {
    const options = {
      root: path.join(__dirname, '../')
    };
    
    res.status(200).sendFile('qrcode.html', options);
  }
}