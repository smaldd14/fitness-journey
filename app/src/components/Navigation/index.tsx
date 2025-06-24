import { Link } from "react-router-dom";
import { UserProfile } from "@/components/auth/UserProfile";
import { useAuthStore } from "@/stores/authStore";

function Navigation() {
  const { user } = useAuthStore();

  return (
    <div className="w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Fitness Journey
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/workouts" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Workouts
                </Link>
                <Link 
                  to="/routines" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Routines
                </Link>
                <Link 
                  to="/exercises" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Exercises
                </Link>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center">
            {user ? (
              <UserProfile />
            ) : (
              <Link 
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;