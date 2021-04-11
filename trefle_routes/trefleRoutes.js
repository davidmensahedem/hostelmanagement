const express = require("express")
const trefleroutes = express.Router();
const fetch = require("node-fetch")

// get all plants

trefleroutes.get("/plants",async (req,res)=>{

    const response = await fetch('https://trefle.io/api/v1/plants?token=Hj42IXuZVMfQlqC5beuksHPeU-Ca61nA4YBouQ_ob2c');
    const {data} = await response.json();
    res.status(200).send(data)
      

})


// filtering by common_name

trefleroutes.get("/plants/commonname/:commonname", async (req,res)=>{
    const response = await fetch(`https://trefle.io/api/v1/plants?token=Hj42IXuZVMfQlqC5beuksHPeU-Ca61nA4YBouQ_ob2c&filter[common_name]=${req.params.commonname}`)
    const {data} = await response.json();
    res.status(200).send(data)
})

// searching through the plants

trefleroutes.get("/plants/search/:searchquery", async (req,res)=>{
    const response = await fetch(`https://trefle.io/api/v1/plants/search?token=Hj42IXuZVMfQlqC5beuksHPeU-Ca61nA4YBouQ_ob2c&q=${req.params.searchquery}`)
    const {data} = await response.json();
    res.status(200).send(data)
})

module.exports = trefleroutes;