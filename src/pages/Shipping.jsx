import React from "react";

const Shipping = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#1a1208] text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/essmeybg.jpg')] bg-cover bg-center"></div>
        <div className="container-custom text-center max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-amber">
            Shipping & Returns
          </h1>
          <p className="text-xl font-light">
            Our policies to ensure your shopping experience is seamless
          </p>
          <div className="w-24 h-1 bg-amber mx-auto mt-8"></div>
        </div>
      </section>

      <div className="container-custom max-w-4xl mx-auto">
        {/* Shipping Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
            Shipping Information
          </h2>
          <div className="w-16 h-1 bg-amber mb-8"></div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
              <h3 className="text-xl font-medium mb-4">Delivery Timeframes</h3>
              <p className="mb-4 text-gray-700">
                We strive to process and ship all orders within 1-2 business
                days. Once shipped, delivery times typically are:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Standard Shipping: 3-5 business days</li>
                <li>Express Shipping: 1-2 business days</li>
                <li>International Shipping: 7-14 business days</li>
              </ul>
              <p className="mt-4 text-gray-700">
                Please note that these are estimated timeframes and may vary
                based on your location and any unforeseen circumstances.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
              <h3 className="text-xl font-medium mb-4">Shipping Costs</h3>
              <p className="mb-4 text-gray-700">
                Our shipping rates are calculated based on the destination and
                the weight of your order:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-sand">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Shipping Method
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Domestic
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        International
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Standard
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        $5.99
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        $15.99
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        Express
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        $12.99
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        $29.99
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-gray-700">
                Free standard shipping is available for all domestic orders over
                $75.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
              <h3 className="text-xl font-medium mb-4">Order Tracking</h3>
              <p className="text-gray-700">
                Once your order ships, you will receive a confirmation email
                with a tracking number. You can track your package by clicking
                the tracking link in the email or visiting our{" "}
                <a href="/track-order" className="text-amber hover:underline">
                  Track Order
                </a>{" "}
                page.
              </p>
            </div>
          </div>
        </section>

        {/* Returns Policy */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
            Returns & Exchanges
          </h2>
          <div className="w-16 h-1 bg-amber mb-8"></div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
              <h3 className="text-xl font-medium mb-4">Return Policy</h3>
              <p className="mb-4 text-gray-700">
                We want you to be completely satisfied with your purchase. If
                for any reason you're not happy with your order, we offer a
                straightforward return policy:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  You have 30 days from the date of delivery to return your
                  items
                </li>
                <li>
                  Products must be unused, in their original condition and
                  packaging
                </li>
                <li>
                  Personalized or custom-made items cannot be returned unless
                  damaged or defective
                </li>
                <li>Sale items are final sale and cannot be returned</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
              <h3 className="text-xl font-medium mb-4">How to Return</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                  Contact our customer service team at returns@essmey.com to
                  initiate your return
                </li>
                <li>
                  You'll receive a Return Authorization Number (RAN) and return
                  instructions
                </li>
                <li>
                  Package your items securely in their original packaging if
                  possible
                </li>
                <li>Include your order number and RAN with your return</li>
                <li>
                  Ship your return to the address provided in the return
                  instructions
                </li>
              </ol>
              <p className="mt-4 text-gray-700">
                Once we receive and inspect your return, we'll process your
                refund within 5-7 business days. The refund will be issued to
                your original payment method.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
              <h3 className="text-xl font-medium mb-4">
                Return Shipping Costs
              </h3>
              <p className="text-gray-700">
                For standard returns, customers are responsible for return
                shipping costs. If you're returning an item due to our error
                (wrong item shipped, defective product, etc.), we will cover the
                return shipping costs and issue a prepaid return label.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16 bg-sand p-8 rounded-lg text-center">
          <h2 className="text-2xl font-serif font-medium mb-4">
            Need Assistance?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            If you have any questions about shipping, returns, or your order,
            our customer service team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="btn-primary bg-amber hover:bg-amber/90"
            >
              Contact Us
            </a>
            <a
              href="/faq"
              className="btn-secondary border-amber text-amber hover:bg-amber/10"
            >
              View FAQs
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shipping;
