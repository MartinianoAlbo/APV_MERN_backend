import express from 'express'
import dotenv from 'dotenv' // permite leer archivos .env
import cors from 'cors'
import conectarDB from './config/db.js'
import veterinariosRoutes from './routes/veterinariosRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'


// Crear el servidor
const app = express();
// Habilitar el bocy-parser
app.use(express.json())

//Lee los archivos .env
dotenv.config();

//Conecta a Mongo DB 
conectarDB();

// Habilitar Cors
const dominiosPermitidos = [process.env.FRONTEND_URL]
const corsOption = {
    origin: (origin, callback) => {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            //El origen del request esta permitido
            callback(null, true)
        }else {
            callback(new Error("No permitido por CORS"))
        }
        
    }
}

app.use(cors(corsOption))

// app.use(urlencoded({extended:true}))

// Habilitar routing
app.use('/api/veterinarios', veterinariosRoutes)
app.use('/api/pacientes', pacienteRoutes)

// definicion del puerto
const PORT = process.env.PORT || 4000 // si no existe el PORT asigna el puerto 4000

// arranque del servidor
app.listen(PORT, () => {
    console.log(`servidor funcionando en: ${PORT}`)
})