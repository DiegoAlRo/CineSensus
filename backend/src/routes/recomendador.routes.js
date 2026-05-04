import express from 'express';
import { recomendarPelicula } from '../controllers/recomendador.controller.js';

const router = express.Router();

router.post('/', recomendarPelicula);

export default router;