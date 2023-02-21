const express = require('express')
const bcrypt = require('bcrypt')
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDoc, doc, setDoc, getDocs} = require('firebase/firestore')
require('dotenv/config')

//config de firebase
const firebaseConfig = {
    apiKey: "AIzaSyAKG6dXnFfGaLkzRSltvfLsqc6HjE_0oF8",
    authDomain: "back-firebase-8a97c.firebaseapp.com",
    projectId: "back-firebase-8a97c",
    storageBucket: "back-firebase-8a97c.appspot.com",
    messagingSenderId: "594115730535",
    appId: "1:594115730535:web:942ccaee80d785c73908c2"
  };

  //iniciar bd firebase
  const firebase = initializeApp(firebaseConfig)
  const db = getFirestore()

  //Iniciar el servidor
  const app = express()

  app.use(express.json())

//ruta para peticiones
//ruta registro
app.post('/registro', (req, res) =>{
  const {name, lastname, email, password, number } = req.body

  //validaciones de los datos
  if(name.length < 3) {
    res.json({'alert': 'nombre requiere min 3 caracteres'})
  } else if(lastname.length < 3) {
    res.json({'alert': 'Apelllido requiere min 3 caracteres'})
  }else if(!email.length) {
    res.json({'alert': 'debes escribir un correo electronico'})
  }else if(password.length < 8) {
    res.json({'alert': 'debes escribir min 8 caracteres en la contraseña'})
  }else if(!Number(number) || number.length < 10) {
    res.json({'alert': 'debes escribir 10 digitos en el numero'})
  } else {
    const users = collection(db, 'users')

    //verificar que el correo no exista en la coleccion
    getDoc(doc(users, email)).then(user => {
      if (user.exists()) {res.json({'alert': 'el correo ya existe en la BD'})
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            req.body.password = hash

            //guardar en la bd
            setDoc(doc(users, email), req.body).then( reg => {
              res.json({
                'alert':'succes',
                'data': reg
              })
            })
          })
        })
      }
    })
  }
})

app.get('/usuarios', async (req, res) => {
 const colRef = collection(db, 'users')
 const docsSnap = await getDocs(colRef)
 let data = []
 docsSnap.forEach(doc => {
  data.push(doc.data())
 })
 res.json({
  'alert': 'success',
  data
 })
})

app.post('/login', (req, res) => {
  let {email, password} = req.body

  if(!email.length || !password.length){
    return res.json({
      'alert': 'No se han recibido datos correctamente'
    })
  }

  const users = collection(db, 'users')
  getDoc(doc(users, email))
  .then(user => {
    if(!user.exists()){
      return res.json({
        'alert' : 'Correo no registrado'
      })
    } else {
      bcrypt.compare(password, user.data().password, (error, result) => {
        if(result) {
          let data = user.data()
          res.json({
            'alert': 'Success',
            name: data.name,
            email: data.email
          })
        } else {
          return res.json({
            'alert': 'Password Incorrecto'
          })
        }
      })
    }
  })
})

  const PORT = process.env.PORT || 19000

  //ejecutamos el servidor
  app.listen(PORT, () => {
    console.log(`ESCUCHANDO EL PUERTO: ${PORT}`)
  })