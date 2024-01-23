const knex = require('knex')(require('../knexfile'))
const {v4: uuid} = require('uuid')

const getConvoList = async (req, res) => {

    const userRooms = await knex("user as user_one").join("message_master", function(){
        this
            .on("user_one.id", "=", "message_master.user_one")
    }).join("user as user_two", function(){
        this.on("user_two.id", "=", "message_master.user_two")
    }).select("message_master.room_id as room_id",
    "user_one.id as user_one_id",
    "user_one.first_name as user_one_first_name",
    "user_one.last_name as user_one_last_name",
    "user_one.email as user_one_email",
    "user_two.id as user_two_id",
    "user_two.first_name as user_two_first_name",
    "user_two.last_name as user_two_last_name",
    "user_two.email as user_two_email"
    ).where(function(){
        this.where("user_two.id", "=", req.user.id)
            .orWhere("user_one.id", "=", req.user.id)
    })

    let returnList = userRooms.map(room => {
        return {
            room_id: room.room_id,
            recipient_id: req.user.id === room.user_one_id ? room.user_two_id : room.user_one_id,
            recipient_first_name: req.user.id === room.user_one_id ? room.user_two_first_name : room.user_one_first_name,
            recipient_last_name: req.user.id === room.user_one_id ? room.user_two_last_name: room.user_one_last_name
        }
    })

    res.status(200).send(returnList)
}

const getConvo = async(req,res)=>{

    const roomCheck = await knex("message_master").where("room_id", "=", req.params.roomId)

    if(roomCheck.length === 0){response.status(404).send("Conversation not found")}

    if(req.user.id !== roomCheck[0].user_one && req.user.id !== roomCheck[0].user_two){response.status(403).send("User may not access this page")}

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
}

const postMessage = async(req, res)=>{
    try{
    const roomCheck = await knex("message_master").where("room_id", "=", req.body.room_id)
    let roomObject;

    if(!req.body.room_id || roomCheck.length === 0){
        const secondCheck = await knex("message_master").where(function() {
            this.where(function(){
                this.where("user_one", "=", req.user.id)
                    .andWhere("user_two", "=", req.body.recipient_id)
            }).orWhere(function(){
                this.where("user_two", "=", req.user.id)
                    .andWhere("user_one", "=", req.body.recipient_id)
            })
        })

        if(secondCheck.length > 0){
            roomObject = secondCheck[0];
        }else{
            let newRoomId = uuid()

            roomObject = {
                room_id: newRoomId,
                user_one: req.user.id,
                user_two: req.body.recipient_id
            }
            await knex("message_master").insert(roomObject)
        }
    }else{

        if(req.user.id !== roomCheck[0].user_one && req.user.id !== roomCheck[0].user_two){
            response.status(403).send("User may not access this page")
            return
        }

        roomObject = roomCheck[0];
    }

    let idArray = await knex("messages").insert({
        room_id: roomObject.room_id,
        from: req.user.id,
        to: req.body.recipient_id,
        message: req.body.message
    })

    const postedMessage = await knex("messages").where("messages.id", "=", idArray[0])
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
    "messages.timestamp AS timestamp");

    res.status(202).send(postedMessage);

    }catch(error){
        res.status(400).send(error)
    }
}

module.exports = 
    {
        getConvoList,
        getConvo,
        postMessage
    }