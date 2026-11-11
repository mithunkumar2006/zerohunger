import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Animated Background */}
      <HeroBackground />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-32">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Side */}
          <HeroContent />

          {/* Right Side */}
          <div className="flex justify-center lg:justify-end">
            <HeroDashboard />
          </div>

        </div>

      </div>
    </section>
  );
}