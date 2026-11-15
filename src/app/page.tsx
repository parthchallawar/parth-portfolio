import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { Credentials } from "@/components/sections/Credentials";
import { Education } from "@/components/sections/Education";
import { Writing } from "@/components/sections/Writing";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <GitHubActivity />
      <Credentials />
      <Education />
      <Writing />
      <Contact />
    </>
  );
}
