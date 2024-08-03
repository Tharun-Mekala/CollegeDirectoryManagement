import "./Login.css"

import React,{ useState }  from 'react'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const roleRedirectMap = new Map([
        ['student', '/studentDashboard'],
        ['faculty', '/facultyDashboard'],
        ['admin', '/administratorDashboard']
      ]);
    
    const handleLogin = async (e) => {
      e.preventDefault();
        console.log(email+" "+password+" "+role+" ")
      const response = await fetch('http://localhost:8080/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          password,
          role,
        }),
      });
      if (response.ok) {
       
        const result = await response.json();
        const { user, profile } = result;
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('profile', JSON.stringify(profile));
        console.log(JSON.stringify(user)+" \n----\n"+JSON.stringify(profile))
        window.location.href = roleRedirectMap.get(role);

      } else {
        alert('Login failed. Please check your credentials and roe.');
      }
    };
    return (
      <div className="main-box">
        <div className="login-box">
          <div className="title">Login</div>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              className="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="text"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </select>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
  )
}

export default Login