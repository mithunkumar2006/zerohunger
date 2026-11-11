import { motion } from "framer-motion";
import { ArrowRight, Building2, Home, HeartHandshake, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-32 bg-gradient-to-br from-green-700 via-emerald-700 to-cyan-800">

      {/* Background Glow */}

      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-cyan-300/10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-12 md:p-16 text-center shadow-2xl"
        >

          <h2 className="text-5xl md:text-6xl font-bold text-white">

            Ready To Rescue Food?

          </h2>

          <p className="text-xl text-white/80 max-w-3xl mx-auto mt-8 leading-9">

            Join our AI Powered Food Rescue Network and become a part
            of the mission to reduce food waste and feed people in need.

          </p>

          {/* Role Buttons */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">

            <Link
              to="/restaurant/register"
              className="bg-white rounded-2xl p-6 hover:scale-105 transition duration-300 shadow-xl"
            >
              <Building2 className="mx-auto text-green-600" size={40} />

              <h3 className="mt-4 font-bold text-xl text-slate-800">

                Restaurant

              </h3>

              <p className="text-gray-500 mt-2">

                Donate surplus food

              </p>

            </Link>

            <Link
              to="/household/register"
              className="bg-white rounded-2xl p-6 hover:scale-105 transition duration-300 shadow-xl"
            >
              <Home className="mx-auto text-blue-600" size={40} />

              <h3 className="mt-4 font-bold text-xl text-slate-800">

                Household

              </h3>

              <p className="text-gray-500 mt-2">

                Share extra meals

              </p>

            </Link>

            <Link
              to="/ngo/register"
              className="bg-white rounded-2xl p-6 hover:scale-105 transition duration-300 shadow-xl"
            >
              <HeartHandshake
                className="mx-auto text-pink-600"
                size={40}
              />

              <h3 className="mt-4 font-bold text-xl text-slate-800">

                NGO

              </h3>

              <p className="text-gray-500 mt-2">

                Receive donations

              </p>

            </Link>

            <Link
              to="/volunteer/register"
              className="bg-white rounded-2xl p-6 hover:scale-105 transition duration-300 shadow-xl"
            >
              <Truck className="mx-auto text-orange-500" size={40} />

              <h3 className="mt-4 font-bold text-xl text-slate-800">

                Volunteer

              </h3>

              <p className="text-gray-500 mt-2">

                Deliver food safely

              </p>

            </Link>

          </div>

          {/* Main Button */}

          <Link
            to="/role-selection"
            className="inline-flex items-center gap-3 mt-16 px-10 py-5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-black transition shadow-xl"
          >
            Get Started Today

            <ArrowRight />

          </Link>

        </motion.div>

      </div>

    </section>
  );
}