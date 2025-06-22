import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Policies = () => {
  return (
    <div className="-mt-4">
      <Accordion type="single" defaultValue="house-rules" collapsible>
        <AccordionItem value="house-rules">
          <AccordionTrigger className="text-primary text-xs font-medium cursor-pointer">
            House rules
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-xs/relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            exercitationem explicabo necessitatibus quos beatae dolore
            repudiandae corporis cupiditate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="refund-policy">
          <AccordionTrigger className="text-primary text-xs font-medium cursor-pointer">
            Refund policy
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-xs/relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            exercitationem explicabo necessitatibus quos beatae dolore
            repudiandae corporis cupiditate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="smoking-policy">
          <AccordionTrigger className="text-primary text-xs font-medium cursor-pointer">
            Smoking policy
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-xs/relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            exercitationem explicabo necessitatibus quos beatae dolore
            repudiandae corporis cupiditate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pet-policy">
          <AccordionTrigger className="text-primary text-xs font-medium cursor-pointer">
            Pet policy
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-xs/relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            exercitationem explicabo necessitatibus quos beatae dolore
            repudiandae corporis cupiditate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="parties-and-events">
          <AccordionTrigger className="text-primary text-xs font-medium cursor-pointer">
            Parties and events
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-xs/relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            exercitationem explicabo necessitatibus quos beatae dolore
            repudiandae corporis cupiditate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="children">
          <AccordionTrigger className="text-primary text-xs font-medium cursor-pointer">
            Children
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-xs/relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            exercitationem explicabo necessitatibus quos beatae dolore
            repudiandae corporis cupiditate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="age-policy">
          <AccordionTrigger className="text-primary text-xs font-medium cursor-pointer">
            Age policy
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-xs/relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            exercitationem explicabo necessitatibus quos beatae dolore
            repudiandae corporis cupiditate.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Policies;