import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import mongoose from 'mongoose'; // enable when MONGODB_URI is set

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/hello', (_req, res) => res.json({ msg: 'hi from api' }));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // if (process.env.MONGODB_URI) await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}
start();
