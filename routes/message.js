const router = require('express').Router();
const controller = require('../controller/message-controller');
const knex = require('knex')(require('../knexfile'))
const {v4: uuid} = require('uuid')

router.route('/').get(controller.getConvoList)
    .post(async(req, res)=>{
        try{
            let roomCheck = [];
        if(req.body.room_id){roomCheck = await knex("message_master").where("room_id", "=", req.body.room_id)}
        let roomObject;
        const id = req.user.user_id;
        if(!req.body.room_id || roomCheck.length === 0){
            const secondCheck = await knex("message_master").where(function() {
                this.where(function(){
                    this.where("user_one", "=", id)
                        .andWhere("user_two", "=", req.body.recipient_id)
                }).orWhere(function(){
                    this.where("user_two", "=", id)
                        .andWhere("user_one", "=", req.body.recipient_id)
                })
            })
    
            if(secondCheck.length > 0){
                roomObject = secondCheck[0];
            }else{
                let newRoomId = uuid()
    
                roomObject = {
                    room_id: newRoomId,
                    user_one: id,
                    user_two: req.body.recipient_id
                }
                await knex("message_master").insert(roomObject)
            }
        }else{
    
            if(id !== roomCheck[0].user_one && id !== roomCheck[0].user_two){
                response.status(403).send("User may not access this page")
            }
    
            roomObject = roomCheck[0];
        }
    
        let idArray = await knex("messages").insert({
            room_id: roomObject.room_id,
            from: id,
            to: req.body.recipient_id,
            message: req.body.message
        })
    
        const postedMessage = await knex("messages").where("room_id", "=", roomObject.room_id)
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
        req.io.to(roomObject.room_id).emit("message", postedMessage)
        res.status(202).json(postedMessage);
    }catch(error){
        console.log(error)
        res.status(402).send(error)
    }
    });
router.route('/:roomId').get(controller.getConvo);

module.exports = router;