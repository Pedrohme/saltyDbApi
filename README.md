# saltyDbApi

## First and foremost, this is a personal project i made to learn typescript and how to create a node.js RESTful api.

<br />
<br />

### It ended up becoming a complete website with an user interface, just because i wanted to learn more stuff.

<br />

This is the web api for the database used in https://github.com/Pedrohme/saltyBot  
They are made to be run together. one won't work (completely) without the other.  
This api manages a database with information about fighters and fights from the website https://www.saltybet.com/  

<br />

At the time of writing, the website was online at https://saltybot-api-pedrohme.herokuapp.com/ (with most features disabled, because free databases don't allow many read/write operations per month)

<br />
<br />

# API

## **Fighter**

<br />

### **GET /api/fighter/?name=X&tier=Y**
Gets a fighter by name and tier, exact match, case sensitive.  
Response if OK:  
JSON:  
```json
{
    "message": "${fighter} found",
    "data": {
        "name": string,
        "tier": string,
        "wins": number,
        "losses": number
    }
}
```
<br />

### **GET /api/fighter/search/?name=X&page=(faunadb Ref().id)&previous=(true/false)**
Gets all fighters that include the passed string in their name, case insensitive.  
Returns 64 values max. Has pagination with "page" and "previous" parameters.  
Rsponse if OK:  
JSON:  
```json
{
    "after" (optional): faunadb Ref(),
    "before" (optional): faunadb Ref(),
    "data": [
        {
            "ref": faunadb Ref(),
            "ts": timestamp,
            "data": {
                "name": string,
                "tier": string,
                "wins": number,
                "losses": number
            }
        },
        ...
        
    ]
}
```

<br />

### **POST /api/fighter/**
Inserts a new fighter in the database.  
Head:  
Key | Value
--- | ---
x-access-token | JWT token  

Body:
Key | Value
--- | ---
name | fightername:string
tier | tier:string

<br />

### **PUT /api/fighter/**
Updates the fighter in the database. Will add the values to the current values.  
Used by passing 1 to wins and 0 to losses for the winner, and vice-versa.  
Head:  
Key | Value
--- | ---
x-access-token | JWT token  

Body:
Key | Value
--- | ---
name | fightername:string
tier | tier:string
wins | 0 or 1
losses | 0 or 1

<br />

## **Fights**

<br />

### **GET /api/fights/?name=X&tier=Y&page=(faunadb Ref().id)&previous=(true/false)**
Gets all fights from a fighter by name and tier, exact match, case sensitive.  
Returns 64 values max. Has pagination with "page" and "previous" parameters.  
Response if OK:  
JSON:
```json
{
    "after" (optional): faunadb Ref(),
    "before" (optional): faunadb Ref(),
    "data": [
        {
            "ref": faunadb Ref(),
            "ts": timestamp,
            "data": {
                "tier": string,
                "fightera": string,
                "fighterb": string,
                "winner": string,
                "timestamp": YYYY/MM/DD
            }
        },
        ...
    ]
}
```

<br />

### **GET /api/fights/both/?fightera=A&fighterb=B&tier=X&page=(faunadb Ref().id)&previous=(true/false)**
Gets all fights where fightera and fighterb fought against each other.  
Returns 64 values max. Has pagination with "page" and "previous" parameters.  
Response if OK:  
JSON:
```json
{
    "after" (optional): faunadb Ref(),
    "before" (optional): faunadb Ref(),
    "data": [
        {
            "ref": faunadb Ref(),
            "ts": timestamp,
            "data": {
                "tier": string,
                "fightera": string,
                "fighterb": string,
                "winner": string,
                "timestamp": YYYY/MM/DD
            }
        },
        ...
    ]
}
```

<br />

### **POST /api/fights/**
Inserts a new fight in the database.
Head:  
Key | Value
--- | ---
x-access-token | JWT token  

Body:
Key | Value
--- | ---
tier | tier:string
fightera | fightername:string
fighterb | fightername:string
winner | fightername:string

<br />

## **Login**

<br />

### **POST /api/login**
Get a valid JWT token to send in the other POST request headers.  
user must be in the database. Passwords are encrypted.  
Body:
Key | Value
--- | ---
user | string
password | string  

<br />

Response if OK:  
JSON:  
```json
{
  auth: true,
  token: string
}
```


