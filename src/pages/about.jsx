function About() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-gray-700 mb-8">
        Welcome to our website! We are passionate about creating beautiful and
        interactive UIs with React and TailwindCSS. Our mission is to provide
        users with smooth, modern, and user-friendly experiences.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {["Our Mission", "Our Vision", "Our Team"].map((title, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-6 hover:shadow-2xl transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
