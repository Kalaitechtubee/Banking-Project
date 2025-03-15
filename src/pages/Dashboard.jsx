import UserProfile from '../components/UserProfile';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your secure dashboard!</p>

      {/* Display User Profile */}
      <UserProfile />
    </div>
  );
};

export default Dashboard;
