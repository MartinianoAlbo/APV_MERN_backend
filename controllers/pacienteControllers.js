import Paciente from '../models/Pacientes.js'

const agregarPacientes = async (req, res, next) => {
  const paciente = new Paciente(req.body)

  paciente.veterinario = req.veterinario._id
  try {
    const pacienteGuardado = await paciente.save()
    res.json(pacienteGuardado)
  } catch (error) {
    console.log(error)
  }
}

const obtenerPacientes = async (req, res, next) => {
  const pacientes = await Paciente.find()
    .where('veterinario')
    .equals(req.veterinario)

  res.json(pacientes)
}

const obtenerPaciente = async (req, res, next) => {
  const { id } = req.params

  const paciente = await Paciente.findById(id)

  if (!paciente) {
    return res.status(404).json({ msg: 'No encontrado' })
  }

  //verifica que el registro fue efectivamente creado por quien lo solicita
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: 'accion no valida' })
  }

  res.json(paciente)
}

const actualizarPaciente = async (req, res, next) => {
  const { id } = req.params

  const paciente = await Paciente.findById(id)
  if (!paciente) {
    return res.status(404).json({ msg: 'No encontrado' })
  }

  //verifica que el registro fue efectivamente creado por quien lo solicita
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: 'accion no valida' })
  }

  //Actializar el paciente
  paciente.nombre = req.body.nombre || paciente.nombre
  paciente.propietario = req.body.propietario || paciente.propietario
  paciente.email = req.body.email || paciente.email
  paciente.telefono = req.body.telefono || paciente.telefono
  paciente.fecha_alta = req.body.fecha_alta || paciente.fecha_alta
  paciente.sintomas = req.body.sintomas || paciente.sintomas


  try {
    const pacienteActualizado = await paciente.save()
    res.json(pacienteActualizado)
  } catch (error) {
    throw new Error(error)
  }
}

const eliminarPaciente = async (req, res, next) => {
  const { id } = req.params

  const paciente = await Paciente.findById(id)

  
  if (!paciente) {
    return res.status(404).json({ msg: 'No encontrado' })
  }

  console.log(paciente.veterinario);
  //verifica que el registro fue efectivamente creado por quien lo solicita
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: 'accion no valida' })
  }

  try {
    await paciente.deleteOne()
    res.json({msg: 'paciente eliminado'})
  } catch (error) {
    console.log('error----',error.message);
    throw new Error(error)
  }
}

export {
  agregarPacientes,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente
}
