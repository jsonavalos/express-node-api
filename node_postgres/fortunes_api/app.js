const fs = require('fs');
const express = require('express');
const fortunes = require('./data/fortunes.json');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get("/fortunes",(req,res)=>{
    console.log('requestions fortunes');
    res.json(fortunes);
});

app.get("/fortunes/random",(req,res)=>{
 const random_index = Math.floor(Math.random()*fortunes.length);
 const r_fortune = fortunes[random_index];
 res.json(r_fortune);

});

app.get("/fortunes/:id", (req,res)=>{
    res.json(fortunes.find(f=> f.id == req.params.id));
});

app.post("/fortunes", (req,res)=>{
    const {message,lucky_number,spirit_animal} = req.body;
    const fortune_ids = fortunes.map(f=> f.id);
    const fortune = {
        id: (fortune_ids.length > 0 ? Math.max(...fortune_ids) : 0),
        message,
        lucky_number,
        spirit_animal
    };
    const new_fortunes = fortunes.concat(fortune);
    fs.writeFile('./data/fortunes.json',JSON.stringify(new_fortunes),err => console.log(err));
    res.json(new_fortunes);
});

app.put('/fortunes/:id',(req,res)=>{ //to update data
    const {id} = req.params;
    const {message,lucky_number,spirit_animal } = req.body; // old ones
    const old_fortune = fortunes.find(f => f.id == id); //reference
    if(message) old_fortune.message = message; //updated 
    if(lucky_number) old_fortune.lucky_number = lucky_number; // updated
    if(spirit_animal) old_fortune.spirit_animal = spirit_animal; //updated
    fs.writeFile("./data/fortunes.json",JSON.stringify(fortunes),err => console.log(err));
    res.json(fortunes);
});


app.delete('/fortunes/:id',(req,res)=>{
    const{id} = req.params;
    const new_fortunes = fortunes.filter(f=> f.id != id);
    fs.writeFile('./data/fortunes.json',JSON.stringify(new_fortunes),err => console.log(err));
    res.json(new_fortunes);
});


module.exports = app;