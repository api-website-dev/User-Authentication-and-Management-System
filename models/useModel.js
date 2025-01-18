import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const useSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name' ]
    },
    email:{
        type:String,
        required:[true,'Please add an email'],
        unique:true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
        
    },
    password:{
        type:String,
        required:[true, "Please enter a password"],
        minLength:[6,'Password must be up to 6 characters'],
        // maxLength:[32, 'Password must not be more than 32 characters']
    },
     photo:{
        type:String,
        required:[true, "Please enter a photo"],
        default: 'https://stock.adobe.com/images/default-profile-picture-avatar-photo-placeholder-vector-illustration/346936114'
     },
     phone:{
        type:String,
        default: '+251-0'
     },
     bio:{
        type:String,
        maxLength:[300, 'Biography must not be more than 300 characters'],
        default:'Diary or Life story'
    },
    timestamps:{
        type:Number, 
        default: Date.now, // Automatically sets the current timestamp
}
});
  //Encrypt password before saving to DB
   useSchema.pre("save",async function(next) {
      if(!this.isModified("password")){
        return next();
      }
      //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next();
  })



const Model = mongoose.model('Model', useSchema)
export default Model;