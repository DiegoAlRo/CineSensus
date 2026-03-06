import Reserva from '../models/Reserva.js'; 

export const obtenerReservas = async (req, res) => { 
    
    try { 
        
        const reservas = await Reserva.find().populate('usuario sesion'); 
        res.json(reservas); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al obtener reservas', error }); 
    } 
}; 

export const crearReserva = async (req, res) => { 
    
    try { const nuevaReserva = new Reserva(req.body); 

        await nuevaReserva.save(); res.status(201).json(nuevaReserva); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al crear reserva', error }); 
    } 
};