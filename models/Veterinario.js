import mongoose from 'mongoose'
import bcrypt from 'bcrypt' // para hashear el password se instala via -npm i bcrypt-
import generarId from '../helpers/generarId.js'



const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    img_perfil: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),
        trim: true
    },
    
    confirmado: {
        type: Boolean,
        default: false,
    }
})

 //meddleware de mongo para hacer algo antes de ...
veterinarioSchema.pre('save', async function(next) {

    if(!this.isModified("password")) next(); // para no volver a hashear un password que ya esta haseado

    const salt = await bcrypt.genSalt(10) // rondas de hasheo
    this.password = await bcrypt.hash(this.password, salt) // modifica antes qie se almacene el password 
})

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema)

export default Veterinario;