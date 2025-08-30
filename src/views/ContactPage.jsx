import { useState, useEffect } from 'react'
import { sendContactMessage } from '../api/interactions'
import { listUsers } from '../api/interactions'
import Newsletter from '../components/Newsletter'

export default function ContactPage() {
    const [sender_name, setName] = useState('')
    const [sender_email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [recipient, setRecipient] = useState('')
    const [users, setUsers] = useState([])
    const [info, setInfo] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        listUsers().then(setUsers).catch(() => { })
    }, [])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedUser = users.find(user => user.id === recipient)

    async function handleSubmit(e) {
        e.preventDefault()
        setInfo('')
        setLoading(true)

        try {
            await sendContactMessage({ sender_name, sender_email, message, recipient })
            setInfo('Message sent successfully!')
            setName('')
            setEmail('')
            setMessage('')
            setRecipient('')
            setSearchTerm('')
        } catch (e) {
            setInfo('Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const selectUser = (user) => {
        setRecipient(user.id)
        setSearchTerm(user.name)
        setShowDropdown(false)
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Send a Message</h1>
                        <p className="text-lg text-gray-600">Connect with other users by sending them a message</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Success/Error Message */}
                        {info && (
                            <div className={`mb-6 p-4 rounded-xl border ${info.includes('successfully')
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-red-50 border-red-200 text-red-800'
                                }`}>
                                <div className="flex items-center">
                                    {info.includes('successfully') ? (
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {info}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Sender Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                                        placeholder="Enter your full name"
                                        value={sender_name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                                        placeholder="your.email@example.com"
                                        value={sender_email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Recipient Selection with Modern Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Send to <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className={`w-full border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 bg-white shadow-sm hover:shadow-md ${showDropdown ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'
                                            }`}
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        {selectedUser ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {selectedUser.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{selectedUser.name}</div>
                                                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Select a recipient...
                                            </div>
                                        )}
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {showDropdown && (
                                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                            {/* Search Input */}
                                            <div className="p-3 border-b border-gray-100">
                                                <input
                                                    type="text"
                                                    placeholder="Search users..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    value={searchTerm}
                                                    onChange={e => setSearchTerm(e.target.value)}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            </div>

                                            {/* User List */}
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredUsers.length === 0 ? (
                                                    <div className="p-4 text-gray-500 text-center">
                                                        {searchTerm ? 'No users found' : 'No users available'}
                                                    </div>
                                                ) : (
                                                    filteredUsers.map(user => (
                                                        <div
                                                            key={user.id}
                                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-150"
                                                            onClick={() => selectUser(user)}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                                                    <span className="text-white font-semibold text-sm">
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                                    rows="6"
                                    placeholder="Write your message here..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    maxLength={1000}
                                    required
                                />
                                <div className="text-xs text-gray-500 mt-1 text-right">{message.length}/1000</div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !recipient}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Message...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Message
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {users.length} active users available to message
                        </p>
                    </div>
                </div>
            </div>
            <Newsletter />
        </>
    )
}