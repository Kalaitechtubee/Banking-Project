import { useUser } from '@clerk/clerk-react'

function UserProfile() {
  const { user } = useUser()

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">User Profile</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.primaryEmailAddress.emailAddress}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
    </div>
  )
}

export default UserProfile