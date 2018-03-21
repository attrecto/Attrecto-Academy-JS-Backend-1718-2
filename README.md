### Steps to start server:
- In terminal:
    - git clone https://github.com/attrecto/Attrecto-Academy-JS-Backend.git
	- cd Attrecto-Academy-JS-Backend/
	- checkout a branch e.g.: git checkout login
	- npm install
	- touch .env
- Open project with any IDE (VisualStudio or Webstorm)
- Copy the content of sample.env into .env file
- Create database/education.db file
- In terminal: npm run init-db
- In terminal: npm run start

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