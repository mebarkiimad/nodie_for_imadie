import mongoose from 'mongoose';

export interface user extends mongoose.Document {
    email: String,
    password: string,
    role:String,
    accessToken:String,
   

}
 
const Schema:any = mongoose.Schema;

const UserSchema = new Schema({
 email: {
  type: String,
  required: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  default: 'basic',
  enum: ["basic", "supervisor", "admin"]
 },
 accessToken: {
  type: String
 },

},{ timestamps: { createdAt: 'createdDate',updatedAt:'updatedDate' } });

 const  User = mongoose.model<user>('user', UserSchema);
 export default User;