import jwt from 'jsonwebtoken' //crear y decodificar jwt

const generarJwt = (id) => {
  //crear un jwt
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    },
  )
}

export default generarJwt
