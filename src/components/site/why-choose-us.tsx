import { Award, Clock, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    description: "Every crew is fully licensed and insured, so your property is protected on every visit.",
  },
  {
    icon: Users,
    title: "One Dedicated Crew",
    description: "The same trained team follows your project or property — no rotating subcontractors.",
  },
  {
    icon: Clock,
    title: "On-Time, Every Time",
    description: "We show up when we say we will, and communicate immediately if anything changes.",
  },
  {
    icon: Award,
    title: "Built to Last",
    description: "From soil prep to stonework, we don't cut corners on materials or technique.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-green-50 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why Amir Outdoor Masters"
          title="The details other crews skip"
          description="We built our process around the two things homeowners care about most: showing up reliably, and doing the work right the first time."
        />
        <StaggerGrid className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => (
            <StaggerItem key={point.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white">
                <point.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-base font-bold text-pine-950">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.description}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  );
}
