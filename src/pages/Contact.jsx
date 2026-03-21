import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { client } from "../utils/sanity";

const Contact = () => {
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      setToast({
        message: "Please fill out all required fields.",
        type: "error",
        show: true
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({
        message: "Please enter a valid email address.",
        type: "error",
        show: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await client.create({
        _type: "contact",
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "No Subject",
        message: formData.message,
        createdAt: new Date().toISOString()
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setToast({
        message: "Message sent successfully!",
        type: "success",
        show: true
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setToast({
        message: "Failed to send message. Please try again later.",
        type: "error",
        show: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (toast?.show) {
      setTimeout(() => {
        setToast(null);
      }, 5000);
    }
  }, [toast]);

  return (
    <div className="py-16 relative">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}>
          <p>{toast.message}</p>
        </div>
      )}
      <div className="container-custom">
        <h1 className="text-4xl font-serif font-medium mb-12 text-center">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start">
              <MapPinIcon className="h-8 w-8 text-amber-500 mr-4" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-neutral-600 mt-1">123 Fragrance Street</p>
                <p className="text-neutral-600">Perfume City, PC 12345</p>
              </div>
            </div>
            <div className="flex items-start">
              <PhoneIcon className="h-8 w-8 text-amber-500 mr-4" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-neutral-600 mt-1">+1 234 567 8900</p>
              </div>
            </div>
            <div className="flex items-start">
              <EnvelopeIcon className="h-8 w-8 text-amber-500 mr-4" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-neutral-600 mt-1">hello@essmey.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <ClockIcon className="h-8 w-8 text-amber-500 mr-4" />
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-neutral-600 mt-1">Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p className="text-neutral-600">Sat: 10:00 AM - 4:00 PM</p>
                <p className="text-neutral-600">Sun: Closed</p>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
