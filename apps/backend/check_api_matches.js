const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst().then(user => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ sub: user.id, email: user.email }, 'supersecretgoleatejwt', { expiresIn: '1d' });
  
  fetch('http://localhost:3000/matches', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data[0]);
    prisma.$disconnect();
  });
});
