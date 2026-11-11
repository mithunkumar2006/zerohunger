import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-green-600 to-blue-600 p-2 rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">FoodRescue</span>
            </div>

            <p className="text-gray-400 text-sm">
              AI-powered platform connecting donors, NGOs and volunteers to reduce food waste.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/role-selection">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Roles</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/restaurant/register">Restaurant</Link></li>
              <li><Link to="/household/register">Household</Link></li>
              <li><Link to="/ngo/register">NGO</Link></li>
              <li><Link to="/volunteer/register">Volunteer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              AI Powered Smart Food Rescue Network
            </p>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          © 2026 Food Rescue Network
        </div>
      </div>
    </footer>
  );
}