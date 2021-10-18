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

At the time of writing, the website was online at https://saltybot-api-pedrohme.herokuapp.com/

<br />
<br />

# API

## **Fighter**

<br />

### **GET /api/fighter/:name**
Gets a fighter by name, exact match, case sensitive.  
Response if OK:  
JSON:
```json
{
    "message": "${fighter} found",
    "data": {
        "id": number,
        "name": string,
        "wins": number,
        "losses": number
    }
}
```
<br />

### **GET /api/fighter/?page=X&limit=Y**
Gets fighters in the order they were inserted in the database, with pagination.  
Rsponse if OK:  
JSON:
```json
{
    "data": [
        {
            "id": number,
            "name": string,
            "wins": number,
            "losses": number
        },
        ...
        
    ]
}
```

<br />

### **GET /api/fighter/:name/search/**
Gets all fighters that include the passed string in their name, case insensitive.  
Response if OK:  
JSON:
```json
{
    "data": [
        {
            "id": number,
            "name": string,
            "wins": number,
            "losses": number
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
wins | 0 or 1
losses | 0 or 1

<br />

## **Fights**

<br />

### **GET /api/fights/:fighter**
Gets all fights from a fighter by name, exact match, case sensitive.  
Response if OK:  
JSON:
```json
{
    "data": [
        {
            "fightera": string,
            "fighterb": string,
            "winner": string,
            "timestamp": YYYY/MM/DD
        },
        ...
        
    ]
}
```

<br />

### **GET /api/fights/?page=X&limit=Y**
Gets fights in the order they were inserted in the database (recent fights first), with pagination.  
Response if OK:  
JSON:
```json
{
    "data": [
        {
            "fightera": string,
            "fighterb": string,
            "winner": string,
            "timestamp": YYYY/MM/DD
        },
        ...
        
    ]
}
```


<br />

### **GET /api/fights/both/?fightera=X&fighterb=Y**
Gets all fights where fightera and fighterb fought agains each other.  
Response if OK:  
JSON:
```json
{
    "data": [
        {
            "fightera": string,
            "fighterb": string,
            "winner": string,
            "timestamp": YYYY/MM/DD
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


