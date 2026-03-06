import Sala from '../models/Sala.js'; 

export const obtenerSalas = async (req, res) => { 
    try { 
        const salas = await Sala.find(); 
        res.json(salas); 
    
    } catch (error) { 
        res.status(500).json({ mensaje: 'Error al obtener salas', error }); 
    } 
}; 

export const crearSala = async (req, res) => { 
    
    try { 
        const nuevaSala = new Sala(req.body); 
        await nuevaSala.save();
        res.status(201).json(nuevaSala); 
    
    } catch (error) { 
        res.status(500).json({ mensaje: 'Error al crear sala', error }); 
    } 
};