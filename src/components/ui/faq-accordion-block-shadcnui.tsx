import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CometCardDemo from "./comet-card-demo";

export function FAQAccordionBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is CampusFlow?",
      answer: "CampusFlow is a smart marketplace and recovery platform designed exclusively for students. It allows you to securely buy and sell items, report lost belongings, and connect with your campus community."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, security is our top priority. We use student email verification and secure meetup protocols to ensure your transactions and data remain private and protected at all times."
    },
    {
      question: "How does the Lost & Found feature work?",
      answer: "Our smart matching system analyzes descriptions and locations to find matches for your lost items. You'll get an instant notification the moment a potential match is reported."
    },
    {
      question: "Can I manage multiple listings?",
      answer: "Absolutely. CampusFlow is designed for flexibility. You can create and manage multiple marketplace listings and lost item reports, all from your secure student dashboard."
    },
    {
      question: "How do meetups work?",
      answer: "We recommend using our designated secure meetup spots on campus. You can coordinate the time and location directly through our secure campus chat system."
    }
  ];

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <Badge className="mb-4" variant="secondary">
            <HelpCircle className="mr-1 h-3 w-3" />
            FAQ
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Have a question? We've got answers. If you don't find what you're looking for, feel free to contact us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* FAQ Accordion - Left Side */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className="overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-md">
                    <motion.button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between p-4 text-left md:p-6"
                      whileHover={{
                        backgroundColor: "rgba(var(--primary), 0.03)",
                      }}
                    >
                      <span className="pr-4 text-base font-semibold md:text-lg">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/50 p-4 md:p-6">
                            <motion.p
                              initial={{ y: -10 }}
                              animate={{ y: 0 }}
                              className="text-sm text-muted-foreground md:text-base"
                            >
                              {faq.answer}
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Comet Card Demo - Right Side */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <CometCardDemo />
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center md:mt-16"
        >
          <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30 p-6 md:p-8 max-w-4xl mx-auto">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              Still have questions?
            </h3>
            <p className="mb-6 text-sm text-muted-foreground md:text-base">
              Our team is here to help. Get in touch and we'll respond as soon as possible.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact">
                <Button size="lg">Contact Support</Button>
              </Link>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
