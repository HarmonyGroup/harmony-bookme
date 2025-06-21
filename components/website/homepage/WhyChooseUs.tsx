import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="bg-blue-50/80">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="">
            <h3 className="text-primary text-base text-center font-semibold">
              All-in-One Booking Hub
            </h3>
            <p className="text-gray-500 text-xs/relaxed text-center max-w-xs mx-auto mt-3">
              Discover and book everything — all in
              one place. No need to juggle multiple apps, links, or contacts.
            </p>
          </div>
          <div>
            <h3 className="text-primary text-base text-center font-semibold">
              Instant Booking, Zero Wait
            </h3>
            <p className="text-gray-500 text-xs/relaxed text-center max-w-xs mx-auto mt-3">
              See it. Like it. Book it. Get instant confirmations and lock in
              your plans without the back-and-forth.
            </p>
          </div>
          {/* <div>
            <h3 className="text-primary text-base text-center font-semibold">
              Book with Confidence
            </h3>
            <p className="text-gray-500 text-xs/relaxed text-center mt-3">
              Every vendor is verified, every listing is vetted. What you see is
              what you get — no surprises, no stories.
            </p>
          </div> */}
          <div>
            <h3 className="text-primary text-base text-center font-semibold">
              Flexible Payment Options
            </h3>
            <p className="text-gray-500 text-xs/relaxed text-center max-w-xs mx-auto mt-3">
              Pay how it works for you — Secure, seamless, and always in your control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
