const express = require('express')
const bcrypt = require('bcrypt')
const { initializeApp } = require('firebase/app')
const { getFirestore} = require('firebase/firestore')
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

  const PORT = process.env.PORT || 19000

  //ejecutamos el servidor
  app.listen(PORT, () => {
    console.log(`ESCUCHANDO EL PUERTO: ${PORT}`)
  })