import { useEffect, useState, useRef } from 'react'
import { fetchMe, updateMe } from '../api/auth'
import { listMyMessages, replyToMessage } from '../api/interactions'
import Newsletter from '../components/Newsletter'

export default function ProfilePage() {
    const [me, setMe] = useState(null)
    const [bio, setBio] = useState('')
    const [name, setName] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [messages, setMessages] = useState([])
    const [replyText, setReplyText] = useState({})
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [replyingTo, setReplyingTo] = useState(null)
    const [expandedMessages, setExpandedMessages] = useState(new Set())
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchMe().then((data) => {
            setMe(data)
            setBio(data.bio || '')
            setName(data.name || '')
            if (data.profile_picture) {
                setPreviewUrl(data.profile_picture)
            }
        })
        listMyMessages().then((d) => setMessages(d?.results || [])).catch(() => { })
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Profile picture must be less than 5MB')
                return
            }
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file')
                return
            }
            setProfilePicture(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setProfilePicture(null)
        setPreviewUrl(me?.profile_picture || null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    async function handleSave(e) {
        e.preventDefault()
        setLoading(true)
        setUpdateSuccess(false)

        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('bio', bio)
            if (profilePicture) {
                formData.append('profile_picture', profilePicture)
            }

            const updated = await updateMe(formData)
            setMe(updated)
            setProfilePicture(null)
            setUpdateSuccess(true)
            setTimeout(() => setUpdateSuccess(false), 3000)
        } catch (error) {
            console.error('Failed to update profile:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleReply(messageId) {
        if (!replyText[messageId]?.trim()) return

        try {
            await replyToMessage(messageId, replyText[messageId])
            setReplyText({ ...replyText, [messageId]: '' })
            setReplyingTo(null)

            // Refresh messages
            const updated = await listMyMessages()
            setMessages(updated?.results || [])
        } catch (e) {
            console.error('Failed to send reply')
        }
    }

    const toggleMessageExpansion = (messageId) => {
        const newExpanded = new Set(expandedMessages)
        if (newExpanded.has(messageId)) {
            newExpanded.delete(messageId)
        } else {
            newExpanded.add(messageId)
        }
        setExpandedMessages(newExpanded)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getUnreadCount = () => {
        return messages.filter(msg => !msg.is_read).length
    }

    const truncateMessage = (message, limit = 150) => {
        if (message.length <= limit) return message
        return message.substring(0, limit) + '...'
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{me?.name || 'Loading...'}</h1>
                                <p className="text-gray-600">{me?.email}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Member since {me?.created_at ? formatDate(me.created_at).split(',')[0] : ''}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`px-3 py-1 rounded-full text-sm ${me?.is_email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {me?.is_email_verified ? '✓ Verified' : 'Pending Verification'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Profile Settings</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('inbox')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inbox'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>Messages</span>
                                    {getUnreadCount() > 0 && (
                                        <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs min-w-[20px] h-5 flex items-center justify-center">
                                            {getUnreadCount()}
                                        </span>
                                    )}
                                    {messages.length > 0 && getUnreadCount() === 0 && (
                                        <span className="bg-gray-400 text-white rounded-full px-2 py-1 text-xs min-w-[20px] h-5 flex items-center justify-center">
                                            {messages.length}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                                <p className="text-gray-600">Update your personal information and profile picture</p>
                            </div>

                            {updateSuccess && (
                                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Profile updated successfully!
                                    </div>
                                </div>
                            )}

                            <div>
                                {/* Profile Picture Section */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile preview"
                                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-gray-200 shadow-md flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex space-x-3">
                                                <label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-200">
                                                    Change Picture
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {(previewUrl && previewUrl !== me?.profile_picture) && (
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            value={me?.email || ''}
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                        rows="4"
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        maxLength={500}
                                    />
                                    <div className="text-xs text-gray-500 mt-1 text-right">{bio.length}/500</div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </div>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inbox' && (
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
                                    <p className="text-gray-600">Manage your received messages and replies</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {getUnreadCount() > 0 && (
                                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {getUnreadCount()} unread
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-500">
                                        {messages.length} total messages
                                    </div>
                                </div>
                            </div>

                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                                    <p className="text-gray-600">You haven't received any messages. When you do, they'll appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div key={message.id} className={`border rounded-xl p-6 transition-all duration-200 ${!message.is_read ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-white hover:shadow-md'
                                            }`}>
                                            {/* Message Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-semibold text-sm">
                                                            {message.sender_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <h4 className="font-semibold text-gray-900 truncate">
                                                                {message.is_sent_by_me ? 'You' : message.sender_name}
                                                            </h4>
                                                            {message.is_sent_by_me && (
                                                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                                                    Sent
                                                                </span>
                                                            )}
                                                            {!message.is_read && (
                                                                <span className="bg-blue-500 w-2 h-2 rounded-full flex-shrink-0"></span>
                                                            )}
                                                            {message.is_reply && (
                                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex-shrink-0">
                                                                    Reply
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate">{message.sender_email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500 flex-shrink-0">
                                                    {formatDate(message.created_at || new Date())}
                                                </div>
                                            </div>
                                            {/* Message Content */}
                                            <div className="mb-4">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    {expandedMessages.has(message.id) || message.message.length <= 150 ? (
                                                        <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
                                                    ) : (
                                                        <div>
                                                            <p className="text-gray-800 whitespace-pre-wrap">{truncateMessage(message.message)}</p>
                                                            <button
                                                                onClick={() => toggleMessageExpansion(message.id)}
                                                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
                                                            >
                                                                Read more
                                                            </button>
                                                        </div>
                                                    )}
                                                    {expandedMessages.has(message.id) && message.message.length > 150 && (
                                                        <button
                                                            onClick={() => toggleMessageExpansion(message.id)}
                                                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
                                                        >
                                                            Show less
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reply Section */}
                                            <div className="border-t border-gray-100 pt-4">
                                                {replyingTo === message.id ? (
                                                    <div className="space-y-3">
                                                        <textarea
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                                            rows="3"
                                                            placeholder="Type your reply..."
                                                            value={replyText[message.id] || ''}
                                                            onChange={e => setReplyText({ ...replyText, [message.id]: e.target.value })}
                                                        />
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleReply(message.id)}
                                                                disabled={!replyText[message.id]?.trim()}
                                                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                                                            >
                                                                Send Reply
                                                            </button>
                                                            <button
                                                                onClick={() => setReplyingTo(null)}
                                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setReplyingTo(message.id)}
                                                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                        </svg>
                                                        <span>Reply</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Newsletter />
        </>
    )
}