import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import { useState } from "react";
import { client } from "../utils/sanity";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  // Simple email validation
  const isEmailValid = email.match(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enhanced query to check for email existence
      const existing = await client.fetch(
        `*[_type == "newsletter" && email == $email]`,
        { email }
      );

      // Check if any existing records are found
      if (existing.length > 0) {
        setMessage("You're already subscribed.");
        setIsSubmitting(false);
        return;
      }

      await client.create({
        _type: "newsletter",
        email,
        subscribedAt: new Date().toISOString(),
      });

      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false); // Ensure button is always re-enabled
    }
  };

  return (
    <footer className="bg-[#1a1208] text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="flex justify-center mb-12">
          <div className="w-28 h-0.5 bg-amber"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Newsletter */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="block text-3xl font-serif font-bold mb-4">
              <span className="text-amber">ESSMEY</span>
            </Link>
            <p className="text-neutral-400 mb-6 max-w-xs">
              Unveil your essence with our handcrafted perfumes, meticulously
              created to reflect your unique personality.
            </p>
            <h4 className="text-sm font-medium mb-3 text-amber">
              SUBSCRIBE TO OUR NEWSLETTER
            </h4>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-[#2a2318] text-white border border-[#3a3328] focus:border-amber outline-none flex-grow transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber text-white font-medium hover:bg-amber/90 transition-colors"
                disabled={isSubmitting || !isEmailValid || email === ""} // Disable button if submitting, invalid email, or empty
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {message && <p className="mt-2 text-sm text-amber">{message}</p>}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium mb-4 uppercase text-amber">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=men"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=women"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=unisex"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Unisex
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Information */}
          <div>
            <h4 className="text-sm font-medium mb-4 uppercase text-amber">
              Help & Information
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-neutral-400 hover:text-amber transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-16 pt-8 border-t border-[#3a3328] flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href="https://www.instagram.com/essmey_unveil"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-amber transition-colors hover:-translate-y-1 transform duration-300"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-amber transition-colors hover:-translate-y-1 transform duration-300"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-amber transition-colors hover:-translate-y-1 transform duration-300"
            >
              <FaTwitter className="h-5 w-5" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-amber transition-colors hover:-translate-y-1 transform duration-300"
            >
              <FaPinterest className="h-5 w-5" />
            </a>
          </div>
          <div className="text-neutral-500 text-sm">
            &copy; {currentYear} ESSMEY. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
