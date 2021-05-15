import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
const PORT = 8081 // process.env.PORT
const app = express();

app.use(json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))
app.use(routes);

export function startServer() {
  app.listen(PORT, () => console.log(`Aplicação sendo executada na porta ${PORT}`));
}