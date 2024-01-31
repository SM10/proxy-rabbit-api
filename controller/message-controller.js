const knex = require('knex')(require('../knexfile'))


const getConvoList = async (req, res) => {
    if(!req.user || !req.user.user_id){res.status(404).send("List of messages not found");}
    else{
    const userRooms = await knex("user as user_one").join("message_master", function(){
        this
            .on("user_one.id", "=", "message_master.user_one")
    }).join("user as user_two", function(){
        this.on("user_two.id", "=", "message_master.user_two")
    }).join("country as country_one", function(){
        this.on("user_one.country_id", "=", "country_one.id")
    }).join("country as country_two", function(){
        this.on("user_two.country_id", "=", "country_two.id")
    }).select("message_master.room_id as room_id",
    "user_one.id as user_one_id",
    "user_one.first_name as user_one_first_name",
    "user_one.last_name as user_one_last_name",
    "user_one.email as user_one_email",
    "country_one.name as user_one_country",
    "user_two.id as user_two_id",
    "user_two.first_name as user_two_first_name",
    "user_two.last_name as user_two_last_name",
    "user_two.email as user_two_email",
    "country_two.name as user_two_country",
    ).where(function(){
        this.where("user_two.id", "=", req.user.user_id)
            .orWhere("user_one.id", "=", req.user.user_id)
    })

    let returnList = userRooms.map(room => {
        return {
            room_id: room.room_id,
            recipient_id: req.user.user_id === room.user_one_id ? room.user_two_id : room.user_one_id,
            recipient_first_name: req.user.user_id === room.user_one_id ? room.user_two_first_name : room.user_one_first_name,
            recipient_last_name: req.user.user_id === room.user_one_id ? room.user_two_last_name: room.user_one_last_name,
            recipient_country_name: req.user.user_id === room.user_one_id ? room.user_two_country: room.user_one_country
        }
    })

    res.status(200).json(returnList)
    }
}

const getConvo = async(req,res)=>{
    try{
    const roomCheck = await knex("message_master").where("room_id", "=", req.params.roomId)

    if(roomCheck.length === 0){res.status(404).send("Conversation not found")}

    if(req.user.user_id !== roomCheck[0].user_one && req.user.user_id !== roomCheck[0].user_two){res.status(403).send("User may not access this page")}

    const convoHistory = await knex("messages").where("room_id", "=", roomCheck[0].room_id)
        .join("user as from", function(){
            this.on("from.id", "=", "messages.from")
        }).join("user as to", function(){
            this.on("to.id", "=", "messages.to")
        }).select("room_id",
        "from.id AS from_id", 
        "from.first_name AS from_first_name",
        "from.last_name AS from_last_name",
        "to.id AS to_id",
        "to.first_name AS to_first_name", 
        "to.last_name AS to_last_name",
        "messages.message AS message",
        "messages.timestamp AS timestamp").orderBy("timestamp", "desc")
    
        res.status(200).send(convoHistory)
    }catch(error){
        res.status(409).send("Failed to get list")
    }
    
}

module.exports = 
    {
        getConvoList,
        getConvo
    }