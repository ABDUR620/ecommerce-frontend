function Contact() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-700 mb-8">
        Have questions? Fill out the form below and we will get back to you soon.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          {["Email: mdabdurrahman62048@gmail.com", "Phone: +91 6204884623", "Address: Bihar, India"].map((info, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-6 hover:shadow-2xl transition duration-300"
            >
              <p className="text-gray-700">{info}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <form className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-6 hover:shadow-2xl transition duration-300 space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
