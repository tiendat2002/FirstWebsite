import db from "../models/index"

let getHomePage= async(req,res)=>{
    try{
        let data = await db.User.findAll();
        return res.render('homePage.ejs',{
        data: JSON.stringify(data),
    });
    } catch(e){
        console.log(e);
    }
}

let getCRUD = (req,res)=>{
    return res.send('con cho sua gau gau')
}

module.exports = {
    getHomePage,
    getCRUD,
}