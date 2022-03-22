import Veterinario from '../models/Veterinario.js'
import generarJwt from '../helpers/generarJWT.js'
import generarId from '../helpers/generarId.js'
import emailRegistro from '../helpers/emailRegistro.js'
import emailOlvidePassword from '../helpers/emailOlvidePassword.js'
 

const registrar = async (req, res) => {
  const { email, nombre } = req.body

  //Prevenir usuarios duplicados
  const existeUsuario = await Veterinario.findOne({
    email,
  })

  if (existeUsuario) {
    const error = new Error(
      '❌ Un usuario registrado con este email ya existe.',
    )
    return res.status(400).json({ msg: error.message })
  }

  try {
    //Guardar un nuevo registro
    const veterinario = new Veterinario(req.body)
    const veterinarioGuardado = await veterinario.save()

    //Enviar email de confirmacion
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    })

    res.send(veterinarioGuardado)
  } catch (error) {
    console.log(error.message)
  }
}

const perfil = (req, res) => {
  const { veterinario } = req

  res.json(veterinario)
}

const confirmar = async (req, res) => {
  const { token } = req.params

  const usuarioConfirmado = await Veterinario.findOne({ token })

  if (!usuarioConfirmado) {
    const error = new Error('❌ Token no valido.')
    return res.status(404).json({ msg: error.message })
  }

  try {
    usuarioConfirmado.token = null
    usuarioConfirmado.confirmado = true
    await usuarioConfirmado.save()

    res.json({ msg: '✅ Usuario Confirmado.' })
  } catch (error) {
    console.log(error)
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body

  //Comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email })
  if (!usuario) {
    const error = new Error('❌ El usuario no existe. ')
    return res.status(404).json({ msg: error.message })
  }

  //Comprobar si el usuario esta confirmado en el correo
  if (!usuario.confirmado) {
    const error = new Error('❌ Tu cuenta no ah sido confirmada.')
    return res.status(403).json({ msg: error.message })
  }

  //Revisar el password -comprobarPassword es un nombre que se declara libremente-
  if (await usuario.comprobarPassword(password)) {
    //Autenticar
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJwt(usuario.id),
    }) //retorna toda la info del usuario
  } else {
    const error = new Error('❌ El password es incorrecto.')
    return res.status(403).json({ msg: error.message })
  }
}

const olvidePassword = async (req, res) => {
  const { email } = req.body

  const existeVeterinario = await Veterinario.findOne({ email })

  if (!existeVeterinario) {
    const error = new Error('❌ El usuario no existe.')
    return res.status(403).json({ msg: error.message })
  }

  try {
    existeVeterinario.token = generarId()
    await existeVeterinario.save()

    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    })
    res.json({ msg: ' 📨 Se envio un email con las instrucciones.0' })
  } catch (error) {
    console.log(error)
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params

  const tokenValido = await Veterinario.findOne({ token })

  if (tokenValido) {
    res.json({ msg: '✅ Token valido!' })
  } else {
    const error = new Error('❌ Token no valido.')
    return res.status(400).json({ msg: error.message })
  }
}

const nuevoPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const veterinario = await Veterinario.findOne({ token })

  if (!veterinario) {
    const error = new Error('❌ Hubo un error. Intentalo de nuevo')
    return res.status(400).json({ msg: error.message })
  }

  try {
    veterinario.token = null
    veterinario.password = password

    await veterinario.save()

    res.json({ msg: '✅ El password fue modificado correctamente.' })
  } catch (error) {
    console.log(error)
  }
}

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id)
  if (!veterinario) {
    const error = new Error('Hubo un error')
    return res.status(400).json({ msg: error.message })
  }

  const {email} = req.body;
  const existeEmail = await Veterinario.findOne({email})

  // if (existeEmail) {
  //   const error = new Error('❌ El email ya esta en uso')
  //   return res.status(400).json({ msg: error.message })
  // }

  try {

    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.telefono = req.body.telefono;
    veterinario.img_perfil = req.body.img_perfil;

    const veterinarioActualizado = await veterinario.save()
    res.json(veterinarioActualizado)

  } catch (error) {
    console.log(error)
  }
}

const actualizarPassword = async (req, res) => {
  const {_id} = req.veterinario
  const {pass, new_pass} = req.body

  
  //comprobar que existe el veterinario
  const veterinario = await Veterinario.findById(_id)
  if (!veterinario) {
    const error = new Error('❌ Hubo un error')
    return res.status(400).json({ msg: error.message })
  }

  //Comprobar el password
  if (await veterinario.comprobarPassword(pass)) {
    veterinario.password = new_pass
    await veterinario.save()
    res.json({ msg: '✅ Se cambio la contraseña con exito'})
  }else{
    const error = new Error('❌ La contraseña actual es incorrecta')
    return res.status(400).json({ msg: error.message })
  }


}

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  nuevoPassword,
  comprobarToken,
  actualizarPerfil,
  actualizarPassword
}
