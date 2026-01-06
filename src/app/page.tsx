import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Resume from "@/components/Resume";
import Journal from "@/components/Journal";
import MissionHUD from '@/components/MissionHUD';
import DiagnosticsOverlay from '@/components/DiagnosticsOverlay';
import Footer from "@/components/Footer";
import ParticlesBackground from "@/components/ParticlesBackground";
import Asteroid from "@/components/Asteroid";
import StickyNav from "@/components/StickyNav";
import MobileNav from "@/components/MobileNav";
import TechStack from "@/components/TechStack";
import { getServices, getProjects, getCertifications, getJournalEntries } from "./actions/portfolio";

export const revalidate = 3600; // Revalidate every hour


export default async function Home() {
  const services = await getServices();
  const projects = await getProjects();
  const certs = await getCertifications();
  const logs = await getJournalEntries();

  console.log(`[DEBUG] Services count: ${services.length}`);
  console.log(`[DEBUG] Projects count: ${projects.length} at ${new Date().toISOString()}`);


  return (
    <main className="min-h-screen bg-brand-light relative overflow-x-hidden">
      <ParticlesBackground />
      <Asteroid />
      <StickyNav />
      <MobileNav />
      <DiagnosticsOverlay />
      <MissionHUD />

      <Hero />
      <Services services={services} />
      <Projects projects={projects} />
      <Certifications certs={certs} />
      <Resume />
      <TechStack />
      <Journal logs={logs} />
      <Footer />
    </main>
  );
}
