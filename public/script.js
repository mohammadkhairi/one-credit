// Register form handler
document.getElementById('registerBtn').addEventListener('click', async () => {
    const email = document.getElementById('registerEmail').value;
    const name = document.getElementById('registerName').value;
    const password = document.getElementById('registerPassword').value;
  
    try {
      const response = await axios.post('/api/auth/register', { email,name, password });
      document.getElementById('registerMessage').innerText = 'Registration Successful!';
    } catch (error) {
      document.getElementById('registerMessage').innerText = 'Error registering user.';
    }
  });
  
  // Login form handler
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.api_token);  // Store the token in localStorage
      localStorage.setItem('email', email);  // Store the token in localStorage
      document.getElementById('loginMessage').innerText = 'Login Successful!';
    } catch (error) {
      document.getElementById('loginMessage').innerText = 'Error logging in.';
    }
  });
  
  // Profile form handler
  document.getElementById('profileBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token) {
      document.getElementById('profileDetails').innerText = 'Please log in to view profile.';
      return;
    }
  
    try {
      const response = await axios.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params:{
        email:email
       }
      });
      document.getElementById('profileDetails').innerText = JSON.stringify(response.data, null, 2);
    } catch (error) {
      document.getElementById('profileDetails').innerText = 'Error retrieving profile.';
    }
  });

  document.getElementById('randomBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      document.getElementById('randomDetails').innerText = 'Please log in to view ramdom.';
      return;
    }
  
    try {
      const response = await axios.get('/api/user/random', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      document.getElementById('randomDetails').innerText = JSON.stringify(response.data, null, 2);
    } catch (error) {
      document.getElementById('randomDetails').innerText = 'Error retrieving ramdom.';
    }
  });
  