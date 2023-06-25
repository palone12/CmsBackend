const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT =  5000;
app.use(cors());

app.use(express.json());



app.get('/', (req, res) => {
    res.send('Welcome to CMS')
  });

let contactsList = [
    {
      "id": 1,
      "name": "John Doe",
      "phone": "1234567890",
      "email": "johndoe@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "phone": "9876543210",
      "email": "janesmith@example.com"
    },
    {
      "id": 3,
      "name": "David Johnson",
      "phone": "5555555555",
      "email": "davidjohnson@example.com"
    }
  ]
  


app.get('/api/contacts', (req, res) => {
  fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
    console.log(data);
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const contacts = JSON.parse(data);
      res.json(contacts);
    }
  });
});

app.get('/api/contacts/:id', (req, res) => {
  const contactId = req.params.id;

  fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const contacts = JSON.parse(data);
      const contact = contacts.find((c) => c.id === contactId);
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    }
  });
});

app.post('/api/contacts', (req, res) => {
  const newContact = req.body;

  fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const contacts = JSON.parse(data);
      contacts.push(newContact);
      fs.writeFile(
        path.join(__dirname, 'contacts.json'),
        JSON.stringify(contacts),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json(newContact);
          }
        }
      );
    }
  });
});

app.put('/api/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  const updatedContact = req.body;

  fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      let contacts = JSON.parse(data);
      const contactIndex = contacts.findIndex((c) => c.id === contactId);
      if (contactIndex !== -1) {
        contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact };
        fs.writeFile(
          path.join(__dirname, 'contacts.json'),
          JSON.stringify(contacts),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.json(contacts[contactIndex]);
            }
          }
        );
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    }
  });
});

app.delete('/api/contacts/:id', (req, res) => {
  const contactId = req.params.id;

  fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      let contacts = JSON.parse(data);
      const contactIndex = contacts.findIndex((c) => c.id === contactId);
      if (contactIndex !== -1) {
        const deletedContact = contacts.splice(contactIndex, 1)[0];
        fs.writeFile(
          path.join(__dirname, 'contacts.json'),
          JSON.stringify(contacts),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.json(deletedContact);
            }
          }
        );
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
