import { ErrorRequestHandler, response } from 'express'
import { ValidationError } from 'yup'

interface ValidationErrors{
  [key: string]: string[]              // a chave é uma string e o valor é um array de strings (cada tipo de erro é um texto)
}

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    let errors: ValidationErrors = {}

    error.inner.forEach(err => {           // forma de retornar os erros pro frontend separados
      errors[err.path] = err.errors
    })

    return res.status(400).json({ message: 'Validation fails', errors})
  }
  
  console.error(error)

  return res.status(500).json({ message: 'Internal server error' })
}

export default errorHandler