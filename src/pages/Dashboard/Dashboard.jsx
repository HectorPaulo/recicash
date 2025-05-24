import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col mt-15">
      <div className="flex flex-1 p-6 gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-lg font-semibold mb-6">Navigation</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="font-medium flex items-center gap-2 text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Dashboard
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
              <Link to="/RecentMovements" className="hover:text-green-600">
                Recent movements
              </Link>
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
              Settings
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
              Log-out
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          <div className="flex gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 flex-1 text-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">DANIEL SANTIAGO</h3>
              <p className="text-gray-600 mb-2">Customer</p>
              <button className="text-green-600 hover:underline">
                Edit Profile
              </button>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-md p-6 flex-1">
              <h4 className="text-sm font-semibold mb-4">BILLING ADDRESS</h4>
              <p className="text-gray-800 font-medium">Daniel Santiago</p>
              <p className="text-gray-600">
                4140 Parker Rd. Allentown, New Mexico
              </p>
              <p className="text-gray-600 mb-2">3134</p>
              <p className="text-gray-600">dainne.ressell@gmail.com</p>
              <p className="text-gray-600 mb-2">(671) 555-0110</p>
              <button className="text-green-600 hover:underline text-sm">
                Edit Address
              </button>
            </div>
          </div>

          {/* Recent Movements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Recent movements</h4>
              <Link
                to="/recent-movements"
                className="text-green-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">DATE</th>
                  <th className="py-2">TOTAL</th>
                  <th className="py-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {[
                  {
                    id: "#738",
                    date: "8 Sep, 2020",
                    total: "$135.00 (5 Products)",
                    status: "Processing",
                  },
                  {
                    id: "#703",
                    date: "24 May, 2020",
                    total: "$25.00 (1 Product)",
                    status: "Processing",
                  },
                  {
                    id: "#130",
                    date: "22 Oct, 2020",
                    total: "$250.00 (4 Products)",
                    status: "Completed",
                  },
                  {
                    id: "#561",
                    date: "1 Feb, 2020",
                    total: "$35.00 (1 Product)",
                    status: "Completed",
                  },
                  {
                    id: "#536",
                    date: "21 Sep, 2020",
                    total: "$578.00 (13 Products)",
                    status: "Completed",
                  },
                  {
                    id: "#492",
                    date: "22 Oct, 2020",
                    total: "$345.00 (7 Products)",
                    status: "Completed",
                  },
                ].map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.id}</td>
                    <td className="py-2">{item.date}</td>
                    <td className="py-2 font-semibold">{item.total}</td>
                    <td
                      className={`py-2 ${
                        item.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-8">
            © 2025 ReciCash. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
