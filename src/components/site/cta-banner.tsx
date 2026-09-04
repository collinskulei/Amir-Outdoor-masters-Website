import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/motion/animated-section";

export function CtaBanner({
  title = "Ready to see what your yard could look like?",
  description = "Get a no-pressure quote from a real crew lead. Most estimates are scheduled within a week.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-green-700 py-20">
      <Container className="text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-green-50/90">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button render={<Link href="/quote" />} nativeButton={false} size="lg" className="btn-clay h-12 px-7 text-base">
              Get a Free Quote
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="h-12 border-white/40 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
            >
              Contact Us
            </Button>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
