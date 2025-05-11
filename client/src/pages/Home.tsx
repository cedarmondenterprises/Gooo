import Hero from "@/components/Hero";
import DomainSetup from "@/components/DomainSetup";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import ContactForm from "@/components/ContactForm";

const Home = () => {
  return (
    <>
      <Hero />
      <DomainSetup />
      <Features />
      <Testimonials />
      <Pricing />
      <Faq />
      <Cta />
      <ContactForm />
    </>
  );
};

export default Home;
