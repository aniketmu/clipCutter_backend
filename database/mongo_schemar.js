import mongoose,{ Schema } from "mongoose";


const User=new Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
      },
});

export default mongoose.model.user || mongoose.model("user",User);
