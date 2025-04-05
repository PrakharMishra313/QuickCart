import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Create a client to send and receive events
export const sycnUserCreation = inngest.createFunction(
  {
    id:'sync-user-from-clerk',
  },
  {event: 'clerk/user.created'},
  async ({event}) => { 
    const {id,first_name,last_name,email_address,image_url} = event.data;
    const user = {
      id:id,
      name:first_name + ' ' + last_name,
      email:email_address[0].email_address,
      imageUrl:image_url
    };
    await connectDB();
    await User.create(user);
  }
);

// inngest update user data in dataBase
const syncUserUpdation = inngest.createFunction(
  {
    id:'update-user-from-clerk',
  },
  {event: 'clerk/user.updated'},
  async ({event}) => { 
    const {id,first_name,last_name,email_address,image_url} = event.data;
    const user = {
      id:id,
      name:first_name + ' ' + last_name,
      email:email_address[0].email_address,
      imageUrl:image_url
    };
    await connectDB();
    await User.findByIdAndUpdate(user.id, user, { new: true });
  }
);

// inngest delete user data in dataBase
const syncUserDeletion = inngest.createFunction(
  {
    id:'delete-user-from-clerk',
  },
  {event: 'clerk/user.deleted'},
  async ({event}) => { 
    const {id} = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);