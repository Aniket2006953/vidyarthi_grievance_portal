import axios from 'axios';

async function run() {
  try {
    // 1. Register
    const regRes = await axios.post('http://localhost:3000/api/auth/register', {
      name: 'Test',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      department: 'CSE',
      semester: '1st Semester',
      roll_number: '12345'
    }).catch(e => e.response);
    
    console.log('Register status:', regRes.status, regRes.data);

    // 2. Login
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }).catch(e => e.response);

    console.log('Login status:', loginRes.status, loginRes.data);
    const token = loginRes.data.token;

    // 3. Get complaints
    const compRes = await axios.get('http://localhost:3000/api/complaints', {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(e => e.response);

    console.log('Complaints status:', compRes.status, compRes.data);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
