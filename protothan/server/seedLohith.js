import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const email = 'lohith123@gmail.com';
    const exists = await User.findOne({ email });
    if (!exists) {
      await User.create({
        name: 'Lohith Admin',
        email: email,
        password: '123456',
        role: 'admin',
        phone: '1234567895',
        address: '100 Admin Plaza, Demo City',
        approved: true,
      });
      console.log(`✅ Seeded: ${email} (admin)`);
    } else {
      console.log(`User ${email} already exists.`);
      // If it exists, let's update its role and password just to be sure it's correct
      exists.role = 'admin';
      exists.password = '123456';
      exists.approved = true;
      await exists.save();
      console.log(`✅ Updated: ${email} to admin with password 123456`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

run();
