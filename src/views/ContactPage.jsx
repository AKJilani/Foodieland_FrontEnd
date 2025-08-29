import { useState } from 'react'
import { sendContactMessage } from '../api/interactions'

export default function ContactPage() {
	const [sender_name, setName] = useState('')
	const [sender_email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [recipient, setRecipient] = useState('')
	const [info, setInfo] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		setInfo('')
		try {
			await sendContactMessage({ sender_name, sender_email, message, recipient })
			setInfo('Message sent!')
			setName(''); setEmail(''); setMessage('')
		} catch (e) {
			setInfo('Failed to send message')
		}
	}

	return (
  <>
    {/* Hero Section */}
    <div className="relative bg-gradient-to-r from-gray-300 to-gray-400 text-white py-24 text-center overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-5"></div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch With Us</h1>
        <p className="mt-3 text-lg opacity-90 max-w-2xl mx-auto">
          We'd love to hear from you. Our team is always ready to assist with any questions you might have.
        </p>
        
        {/* Decorative elements */}
        <div className="flex justify-center mt-8 space-x-6">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <i className="fas fa-envelope text-xl"></i>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <i className="fas fa-phone-alt text-xl"></i>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <i className="fas fa-map-marker-alt text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <section className="max-w-6xl mx-auto px-6 py-16 -mt-10 relative z-10">
      <div className="grid md:grid-cols-3 gap-10">
        
        {/* Left Side - Contact Details + Image */}
        <div className="space-y-8">
          <div className="p-8 shadow-xl border rounded-2xl space-y-6 bg-white transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <i className="fas fa-info-circle mr-2 text-gray-600"></i>
              Get in Touch
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-gray-600 text-xl mr-4 w-6 text-center">
                  📍
                </div>
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">123 Foodie Street, Dhaka</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-gray-600 text-xl mr-4 w-6 text-center">
                  📞
                </div>
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <p className="text-gray-600">+880 1234 567890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-gray-600 text-xl mr-4 w-6 text-center">
                  ✉️
                </div>
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p className="text-gray-600">support@akjilanitheleader.com</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium text-gray-700 mb-2">Business Hours</h4>
              <p className="text-gray-600">Monday - Friday: 9am - 10pm</p>
              <p className="text-gray-600">Saturday - Sunday: 10am - 11pm</p>
            </div>
          </div>

          {/* Image in bottom left column */}
          <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200">
            <img 
              src="/images/chef.jpg"
              alt="Our restaurant interior" 
              className="w-full h-81 object-cover"
            />
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="md:col-span-2">
          <div className="p-10 shadow-2xl border rounded-2xl bg-white">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-semibold text-gray-800">Send us a message</h3>
              <p className="text-gray-600 mt-2">Fill out the form below and we'll get back to you as soon as possible</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  className="peer w-full border-2 border-gray-200 rounded-xl px-5 pt-7 pb-3 focus:border-gray-600 focus:outline-none focus:ring-0 transition-all duration-300 hover:shadow-[0_0_15px_rgba(100,100,100,0.1)] focus:shadow-[0_0_20px_rgba(100,100,100,0.15)]"
                  placeholder=" "
                  value={sender_name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label
                  htmlFor="name"
                  className="absolute left-5 top-5 text-gray-500 font-medium transition-all duration-300 pointer-events-none peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-sm"
                >
                  Your Full Name
                </label>
                <div className="absolute right-4 top-4 text-gray-500">
                  <i className="fas fa-user"></i>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="peer w-full border-2 border-gray-200 rounded-xl px-5 pt-7 pb-3 focus:border-gray-600 focus:outline-none focus:ring-0 transition-all duration-300 hover:shadow-[0_0_15px_rgba(100,100,100,0.1)] focus:shadow-[0_0_20px_rgba(100,100,100,0.15)]"
                  placeholder=" "
                  value={sender_email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-5 text-gray-500 font-medium transition-all duration-300 pointer-events-none peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-sm"
                >
                  Your Email Address
                </label>
                <div className="absolute right-4 top-4 text-gray-500">
                  <i className="fas fa-envelope"></i>
                </div>
              </div>

              {/* Recipient */}
              <div className="relative">
                <input
                  id="recipient"
                  type="text"
                  className="peer w-full border-2 border-gray-200 rounded-xl px-5 pt-7 pb-3 focus:border-gray-600 focus:outline-none focus:ring-0 transition-all duration-300 hover:shadow-[0_0_15px_rgba(100,100,100,0.1)] focus:shadow-[0_0_20px_rgba(100,100,100,0.15)]"
                  placeholder=" "
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <label
                  htmlFor="recipient"
                  className="absolute left-5 top-5 text-gray-500 font-medium transition-all duration-300 pointer-events-none peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-sm"
                >
                  Recipient User ID (Optional)
                </label>
                <div className="absolute right-4 top-4 text-gray-500">
                  <i className="fas fa-at"></i>
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  id="message"
                  rows="5"
                  className="peer w-full border-2 border-gray-200 rounded-xl px-5 pt-7 pb-3 focus:border-gray-600 focus:outline-none focus:ring-0 transition-all duration-300 resize-none hover:shadow-[0_0_15px_rgba(100,100,100,0.1)] focus:shadow-[0_0_20px_rgba(100,100,100,0.15)]"
                  placeholder=" "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-5 top-5 text-gray-200 font-medium transition-all duration-300 pointer-events-none peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-sm"
                >
                  Your Message
                </label>
                <div className="absolute right-4 top-4 text-gray-500">
                  <i className="fas fa-comment"></i>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] hover:shadow-[0_0_20px_rgba(100,100,100,0.2)] focus:shadow-[0_0_25px_rgba(100,100,100,0.25)] focus:outline-none"
              >
                Send Message
                <i className="fas fa-paper-plane ml-2"></i>
              </button>

              {info && (
                <div className={`p-3 rounded-lg text-center ${info.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {info}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>

    {/* Full Width Map Below Contact Form */}
    <div className="w-full px-0 mt-8">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.509079823479!2d90.412518!3d23.810331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b49b2a05%3A0xabcd1234abcd5678!2sDhaka!5e0!3m2!1sen!2sbd!4v1693123456789"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        className="w-full"
      ></iframe>
    </div>
  </>
);
}


