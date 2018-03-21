# Attrecto-Academy-JS-Backend
---
codeshare link: https://codeshare.io/2EJNNo

---
### Steps to start server:
1. In terminal:
	a. git clone https://github.com/attrecto/Attrecto-Academy-JS-Backend.git
	b. cd Attrecto-Academy-JS-Backend/
	c. git checkout login
	d. npm install
	e. touch .env
2. Open project with any IDE (VisualStudio or Webstorm)
3. Copy the content of sample.env into .env file
4. Create database/education.db file
5. In terminal: npm run init-db
6. In terminal: npm run start

### Call web-services with Postman:
##### Create user
- Method: POST
- Url: localhost:3000/api/user
- Header ('key' - 'value'):
    - 'Content-Type' - 'application/json'
- Body:
```json
{
    "email": "test.elek@test.com",
    "name": "Test Elek",
    "password": "elekpwm01"
}
```

##### Login
- Method: POST
- Url: localhost:3000/api/login
- Header ('key' - 'value'):
    - 'Content-Type' - 'application/json'
- Body:
```json
{
    "email": "test.elek@test.com",
    "password": "elekpwm01"
}
```

##### Hello world
- Method: GET
- Url: localhost:3000/api/hello
- Header ('key' - 'value'):
    - 'Content-Type' - 'application/json'
    - 'Authorization' - 'Bearer token-from-login-response'
        - E.g.: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsIm5hbWUiOiJUZXN0IEVsZWsiLCJlbWFpbCI6InRlc3QuZWxlazRAdGVzdC5jb20iLCJpYXQiOjE1MjE2NjI3MTgsImV4cCI6MTUyMTcwNTkxOH0.sSu5Eq3ICPKJwi8n_HBrcP8VYpvQrssEgv9E1rDpQbLGi7azFkaZNtZb29MHgTexl-dyB-p-cH-gTs6KoKfjCA