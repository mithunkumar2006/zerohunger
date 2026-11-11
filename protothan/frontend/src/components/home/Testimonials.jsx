import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "ABC Restaurant",
    role: "Restaurant Partner",
    image: "🍽",
    review:
      "Food Rescue helped us donate surplus food daily. We reduced waste and helped hundreds of families.",
  },
  {
    name: "Hope Foundation",
    role: "NGO",
    image: "🏢",
    review:
      "The AI matching system instantly connects us with nearby food donations. It saves us hours every day.",
  },
  {
    name: "Rahul Kumar",
    role: "Volunteer",
    image: "🚚",
    review:
      "Volunteer routing is amazing. Pickup requests arrive instantly and navigation is smooth.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-900 py-28">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >

          <p className="uppercase tracking-[6px] text-green-400 font-semibold">

            Testimonials

          </p>

          <h2 className="text-5xl font-bold text-white mt-5">

            Trusted By Restaurants, NGOs & Volunteers

          </h2>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg">

            Thousands of meals are rescued every week with the help of our
            intelligent platform.

          </p>

        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 overflow-hidden"
            >

              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>

              <Quote
                size={42}
                className="text-green-400 mb-6"
              />

              <div className="flex mb-6">

                {[1, 2, 3, 4, 5].map((star) => (

                  <Star
                    key={star}
                    size={20}
                    fill="#22c55e"
                    color="#22c55e"
                  />

                ))}

              </div>

              <p className="text-gray-300 leading-8">

                "{item.review}"

              </p>

              <div className="flex items-center mt-10">

                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-3xl">

                  {item.image}

                </div>

                <div className="ml-4">

                  <h4 className="text-white font-bold text-lg">

                    {item.name}

                  </h4>

                  <p className="text-green-400">

                    {item.role}

                  </p>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}