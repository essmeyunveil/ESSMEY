import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/essmeybg.jpg')] bg-cover bg-center"></div>
        <div className="container-custom text-center max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-amber">
            Our Story
          </h1>
          <p className="text-xl font-light">
            Unveiling the passion behind Essmey's handcrafted perfumes
          </p>
          <div className="w-24 h-1 bg-amber mx-auto mt-8"></div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="container-custom max-w-4xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
              The Beginning
            </h2>
            <p className="mb-4">
              At Essmey, we believe that every individual has a unique essence
              waiting to be unveiled. Born out of a college student's passion
              for fragrances, Essmey stands as a testament to dedication,
              creativity, and the art of perfumery.
            </p>
            <p>
              What started as a hobby in a small dorm room has blossomed into a
              brand that celebrates individuality through scent. Our founder's
              journey of experimentation and discovery laid the foundation for
              what Essmey is today - a brand that cherishes the artisanal
              approach to perfume-making.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg shadow-md hover-glow">
            <img
              src="/images/collegestudent.jpg"
              alt="Essmey Beginning"
              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 overflow-hidden rounded-lg shadow-md hover-glow">
            <img
              src="/images/organic.jpg"
              alt="Essmey Craftsmanship"
              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
              Our Craftsmanship
            </h2>
            <p className="mb-4">
              Each bottle of Essmey perfume is a labor of love, meticulously
              crafted by hand to ensure quality and uniqueness. We believe in
              the power of slow beauty - taking the time to perfect each
              formulation, test, and adjust until the scent tells exactly the
              story we want it to tell.
            </p>
            <p>
              Our small-batch production allows us to maintain stringent quality
              control, ensuring that every product that bears the Essmey name is
              nothing short of exceptional. From ingredient selection to the
              final packaging, every step is handled with care and attention to
              detail.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
              Our Philosophy
            </h2>
            <p className="mb-4">
              At Essmey, we believe that fragrance is more than just a pleasant
              scent - it's a form of self-expression, a statement of identity,
              and a powerful trigger for memories and emotions. Our philosophy
              is centered around creating scents that help individuals express
              their true essence.
            </p>
            <p className="mb-4">
              We are committed to ethical sourcing and sustainable practices.
              Wherever possible, we use ingredients that are responsibly
              harvested and packaging materials that minimize environmental
              impact. We believe that luxury and consciousness can coexist.
            </p>
            <p>
              Our vision is to create a world where everyone can find a
              fragrance that resonates with their personal story, a scent that
              feels like an extension of themselves rather than just something
              they wear.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg shadow-md hover-glow">
            <img
              src="/images/tusu.jpg"
              alt="Essmey Philosophy"
              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Adding fourth section with collage.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 overflow-hidden rounded-lg shadow-md hover-glow">
            <img
              src="/images/collage.jpg"
              alt="Essmey Collection"
              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
              Our Collection
            </h2>
            <p className="mb-4">
              Essmey's collection is a reflection of diverse inspirations, from
              nature's bounty to urban sophistication. Each fragrance in our
              portfolio is designed to evoke specific emotions and memories,
              carefully balanced to create a sensory experience that's both
              familiar and unique.
            </p>
            <p>
              We take pride in creating scents that are distinctive yet
              wearable, sophisticated yet approachable. Our fragrance families
              range from fresh and citrusy to warm and woody, ensuring there's
              an Essmey perfume for every personality and occasion.
            </p>
          </div>
        </div>

        {/* Adding fifth section with welcome.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
              Our Community
            </h2>
            <p className="mb-4">
              At Essmey, we believe in building more than just a brand – we're
              creating a community of fragrance enthusiasts who appreciate the
              artistry behind perfumery. Our customers are not just buyers;
              they're part of our extended family, sharing in our passion for
              unique scents.
            </p>
            <p>
              We value the feedback and stories our community shares with us.
              These interactions inspire us to continue innovating and crafting
              new fragrances that resonate with our audience. Together, we're
              redefining the world of artisanal perfumery, one bottle at a time.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg shadow-md hover-glow">
            <img
              src="/images/welcome.jpg"
              alt="Essmey Community"
              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sand py-16 mb-16">
        <div className="container-custom">
          <h2 className="text-3xl font-serif font-medium mb-4 text-center text-amber">
            Our Values
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto">
            The principles that guide our artisanal approach to perfumery and
            define what makes Essmey unique
          </p>
          <div className="w-24 h-1 bg-amber mx-auto mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-amber border-b-2 border-transparent rounded-md">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div className="text-4xl font-serif mb-4 text-amber">
                Craftsmanship
              </div>
              <p>
                We believe in the value of handcrafted products, made with
                attention to detail and a commitment to excellence. Each bottle
                is a work of art, created with passion and precision.
              </p>
            </div>

            <div className="bg-white p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-amber border-b-2 border-transparent rounded-md">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="text-4xl font-serif mb-4 text-amber">
                Authenticity
              </div>
              <p>
                We stay true to our artisanal roots, creating genuine fragrances
                that tell a story. We value honesty in our relationships with
                customers and transparency in our processes.
              </p>
            </div>

            <div className="bg-white p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-amber border-b-2 border-transparent rounded-md">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-4xl font-serif mb-4 text-amber">
                Individuality
              </div>
              <p>
                We celebrate the unique essence of each person. Our fragrances
                are designed to complement individual personalities, not mask
                them or make everyone smell the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="container-custom text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
          Join Our Journey
        </h2>
        <p className="mb-8">
          We invite you to be part of the Essmey story. Explore our collection
          of handcrafted perfumes and find the scent that speaks to your
          essence. Follow us on social media to stay updated on new releases,
          behind-the-scenes glimpses, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="btn-primary bg-amber hover:bg-amber/90 px-8"
          >
            Shop Collection
          </Link>
          <Link
            to="/contact"
            className="btn-secondary border-amber text-amber hover:bg-amber/10 px-8"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
