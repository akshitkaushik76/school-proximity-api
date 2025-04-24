const db = require('../db');
const axios  = require('axios');
function calculateDistance(lat1,lon1,lat2,lon2) {
    const R = 6371;
    const dlat = (lat2-lat1)*(Math.PI/180);//converting degree to radians
    const dlon = (lon2-lon1)*(Math.PI/180);
    const a = Math.sin(dlat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dlon/2)**2;
    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c;
}
exports.addSchools = async(req,res,next)=>{
    const {name,address,latitude,longitude} = req.body;
    if(!name||!address||!latitude||!longitude) {
        return res.status(400).json({status:'fail',message:'not successful'});
    }
    const sql = 'INSERT INTO schools (name,address,latitude,longitude) VALUES (?,?,?,?)';
    db.query(sql,[name,address,latitude,longitude],(err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        res.status(201).json({message:'data entered successfully',id:result.id});
    });
}

exports.listSchools = async(req,res,next)=>{
   const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;//to remove the proxies server effect from changing the root ip address
   try{
    const response = await axios.get(`https://ipwho.is/${ip}`);
    const {latitude,longitude,success,message} = response.data
    console.log('the latitude:',latitude);
    console.log('the longitude:',longitude);
    if(!success) {
        return res.status(400).json({message:`ip lookup failed:${message}`});
    }
    const sql = 'SELECT * FROM schools';
    db.query(sql,(err,results)=>{
        if(err) return res.status(500).json({error:err.message});
        const sorted = results.map(school=>({
            ...school,
            distance:calculateDistance(latitude,longitude,school.latitude,school.longitude),
        })).sort((a,b)=>a.distance-b.distance);
        res.json(sorted);
    })
   }
   catch(error) {
    res.status(500).json({error:error.message});
   }
};