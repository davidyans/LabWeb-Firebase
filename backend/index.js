import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDK-Zgd1LpXX8wxoAqi4KwREOTSKEUNKgA",
    authDomain: "studentproject-973cf.firebaseapp.com",
    projectId: "studentproject-973cf",
    storageBucket: "studentproject-973cf.appspot.com",
    messagingSenderId: "40610164034",
    appId: "1:40610164034:web:e411923bb41fdcec996cdb"
  };

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// Get a list of cities from your database
async function getStudents(db) {
  const studentsCol = collection(db, 'students');
  const studentsSnapshot = await getDocs(studentsCol);
  const studentsList = studentsSnapshot.docs.map(doc => doc.data());
  return studentsList;
}

const students = await getStudents(db);
console.log(students);

//const express = require('express')
import express from 'express';
const app = express()
app.use(express.json()); // Se agrega esta linea
const port = 3000

app.get('/', (req, res) => {
  res.send('EPN-FIS')
})

// read all student
app.get("/api/read", (req, res) => {
    (async () => {
      try {
        let response = [];
        //await query.get().then(querySnapshot => {
        const querySnapshot = await getDocs(collection(db, "students"));
        //let docs = querySnapshot.docs;
        //for (let doc of docs) {
        querySnapshot.forEach((doc) => {
          const selectedItem = {
            id: doc.id,
            student: doc.data(),
          };
          response.push(selectedItem);
        });
        return res.status(200).send(response);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});

// read one student
app.get("/api/read/:item_id", (req, res) => {
    (async () => {
      try {
        let response = [];
        const q = query(
          collection(db, "students"),
          where("ID", "==", parseInt(req.params.item_id))
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const selectedItem = {
            id: doc.id,
            student: doc.data(),
          };
          response.push(selectedItem);
        });
        return res.status(200).send(response);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });

  // create student
app.post("/api/create", (req, res) => {
    (async () => {
      try {
        console.log(req.body.student);
        /*    CREANDO UN STUDENT POR HARDCODE
              const docRef = await addDoc(collection(db, "students"), {
                  ID: 2,
                  name: "Jane Smith",
                  age: 17,
                  grade:"B"
                });
                */
        const docRef = await addDoc(collection(db, "students"), req.body.student);
        return res.status(200).send(`Student created with ID:  ${docRef.id}`);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });

// update
app.put("/api/update/:item_id", (req, res) => {
    (async () => {
      try {
        console.log(req.params.item_id);
        const studentDocumentId = doc(db, "students", req.params.item_id);
        await updateDoc(studentDocumentId, req.body.student);
        return res.status(200).send();
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });

// delete
app.delete("/api/delete/:item_id", (req, res) => {
    (async () => {
      try {
        //const studentDocumentId = doc(db, "students", req.params.item_id);
        //console.log(req.params.item_id, studentDocumentId);
        await deleteDoc(doc(db, "students", req.params.item_id));
        return res.status(200).send();
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})