import User from "../models/User.js";

const demoUsers = [
  {
    name: "Demo Restaurant",
    email: "restaurant@demo.com",
    password: "123456",
    role: "restaurant",
    phone: "1234567890",
    address: "123 Food Street, Demo City",
    licenseNumber: "LIC-REST-001",
    approved: true,
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    name: "Demo Household",
    email: "household@demo.com",
    password: "123456",
    role: "household",
    phone: "1234567891",
    address: "456 Home Avenue, Demo City",
    houseName: "Demo Residence",
    approved: true,
    latitude: 13.0895,
    longitude: 80.2785,
  },
  {
    name: "Demo NGO",
    email: "ngo@demo.com",
    password: "123456",
    role: "ngo",
    phone: "1234567892",
    address: "789 Charity Lane, Demo City",
    ngoRegistration: "REG-NGO-DEMO-001",
    approved: true,
    latitude: 13.0650,
    longitude: 80.2500,
    mealsNeeded: 150,
  },
  {
    name: "Demo Volunteer",
    email: "volunteer@demo.com",
    password: "123456",
    role: "volunteer",
    phone: "1234567893",
    address: "321 Delivery Road, Demo City",
    vehicle: "Bicycle",
    availability: "flexible",
    approved: true,
    latitude: 13.0720,
    longitude: 80.2620,
  },
  {
    name: "Demo Admin",
    email: "admin@demo.com",
    password: "123456",
    role: "admin",
    phone: "1234567894",
    address: "100 Admin Plaza, Demo City",
    approved: true,
    latitude: 13.0800,
    longitude: 80.2700,
  },
  {
    name: "Lohith Admin",
    email: "lohith123@gmail.com",
    password: "123456",
    role: "admin",
    phone: "1234567895",
    address: "100 Admin Plaza, Demo City",
    approved: true,
    latitude: 13.0800,
    longitude: 80.2700,
  },
];

export default async function seedDemoUsers() {
  try {
    for (const userData of demoUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`✅ Demo user seeded: ${userData.email} (${userData.role})`);
      } else {
        exists.isSuspended = false;
        exists.approved = true;
        exists.latitude = userData.latitude;
        exists.longitude = userData.longitude;
        if (userData.mealsNeeded !== undefined) {
          exists.mealsNeeded = userData.mealsNeeded;
        }
        await exists.save();
      }
    }
    console.log("✅ Demo user seeding complete");
  } catch (error) {
    console.error("❌ Demo user seeding failed:", error.message);
  }
}
