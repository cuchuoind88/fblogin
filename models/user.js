const mongoose=require('mongoose');
const LocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema(
    {
        admin :
        {
            type:Boolean,
            default:false
        },
        firstName :
    {
        type:String,
        default:''
    },
        lastName :
    {
        type:String,
        default:''
    },
        facebookID:
        {
            type:String
        }
    }
)
UserSchema.plugin(LocalMongoose);
const User=mongoose.model('User',UserSchema);
module.exports=User;
