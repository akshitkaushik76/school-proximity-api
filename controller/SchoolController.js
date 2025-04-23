const db = require('../db');
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
    const {lat,lon} = req.body;
    if(!lat || lon) {
        return res.status(400).json({status:'fail',message:'not successful'});
    }
    const sql = 'SELECT * FROM schools'
    db.query(sql,(err,result)=>{
        if(err) return res.status(500).json({status:'fail',error:err});
        const sorted = results.map(school=>({
            ...school,
            distance:calculateDistance(Number(lat),Number(lon),school.latitude,school.longitude)
        })).sort((a,b)=>a.distance-b.distance);
        res.json(sorted);
    });
}