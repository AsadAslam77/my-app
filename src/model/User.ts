import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document {

    Content: string;
    CreatedAt: Date
}
const MessageSchema: Schema<Message> = new Schema({
    Content: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        required: true,
        default: Date.now()

    }
})
export interface User extends Document {

    username: string;
    email: string,
    password: string, 
    // message: [Message]

}
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'username is required '],
        trim: true,
        unique: true

    },
    email: {
        type: String,
        required: [true, "email is required"],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'please use a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password  is required '],
        unique: true

    },
   
   

    
    
    // message: [MessageSchema]
       
    

})
   const userModel=(mongoose.models.user as mongoose.Model<User>) ||
   (mongoose.model("User",UserSchema));
   export default userModel;