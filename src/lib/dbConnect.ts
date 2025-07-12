import { promises } from 'dns';
import mongoose from 'mongoose';

interface Connection {
  isConnected?: number;  // mongoose.Connection.readyState is a number
}

const connection: Connection = {};

async function dbConnect():Promise<void> {
  if (connection.isConnected) {
    return;
  }
try{

  console.log('uri is:' + process.env.MONGODB_URI);
  const db = await mongoose.connect(process.env.MONGODB_URI as string, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  console.log(db);

  connection.isConnected = db.connections[0].readyState;
  console.log("Db Connected successfuly ")
}catch(error){
    console.log("DataBase Connection Failed",error)
     process.exit(1)
}
}

export default dbConnect;