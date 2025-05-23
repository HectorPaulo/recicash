import React from "react";
import { Link } from "react-router-dom";

const RecentMovements = () => {
  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      {/* Header Superior */}
      <div className="flex justify-between items-center bg-green-500 text-white px-8 py-3 text-sm">
        <div className="text-lg font-bold">ReciCASH</div>
        <div className="space-x-6">
          <span className="cursor-pointer">Mi cuenta ▼</span>
          <span className="cursor-pointer">About Us</span>
        </div>
      </div>

      <div className="flex flex-1 p-6 gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-lg font-semibold mb-6">Navigation</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
              <Link to="/Dashboard" className="hover:text-green-600">
                Dashboard
              </Link>
            </li>
            <li className="font-medium flex items-center gap-2 text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Recent movements
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
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6">Recent movements</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-2">ORDER ID</th>
                    <th className="pb-2">DATE</th>
                    <th className="pb-2">TOTAL</th>
                    <th className="pb-2">STATUS</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {[
                    {
                      id: "#3933",
                      date: "4 April, 2021",
                      total: "$135.00 (5 Products)",
                      status: "Processing",
                    },
                    {
                      id: "#5045",
                      date: "27 Mar, 2021",
                      total: "$25.00 (1 Product)",
                      status: "Processing",
                    },
                    {
                      id: "#5028",
                      date: "20 Mar, 2021",
                      total: "$250.00 (4 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#4600",
                      date: "19 Mar, 2021",
                      total: "$35.00 (1 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#4152",
                      date: "18 Mar, 2021",
                      total: "$578.00 (13 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#8811",
                      date: "10 Mar, 2021",
                      total: "$345.00 (7 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#3536",
                      date: "5 Mar, 2021",
                      total: "$560.00 (2 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#1374",
                      date: "27 Feb, 2021",
                      total: "$560.00 (2 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#7791",
                      date: "25 Feb, 2021",
                      total: "$560.00 (2 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#4846",
                      date: "24 Feb, 2021",
                      total: "$23.00 (1 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#5948",
                      date: "20 Feb, 2021",
                      total: "$23.00 (1 Products)",
                      status: "Completed",
                    },
                    {
                      id: "#1577",
                      date: "12 Oct, 2020",
                      total: "$23.00 (1 Products)",
                      status: "Completed",
                    },
                  ].map((item, index) => (
                    <tr key={index} className="border-b hover:bg-green-50">
                      <td className="py-3">{item.id}</td>
                      <td className="py-3">{item.date}</td>
                      <td className="py-3 font-medium">{item.total}</td>
                      <td
                        className={`py-3 ${
                          item.status === "Completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="py-3">
                        <button className="text-green-600 hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                ‹
              </button>
              <button className="px-3 py-1 rounded bg-green-500 text-white">
                1
              </button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                2
              </button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                3
              </button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                ›
              </button>
            </div>
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

export default RecentMovements;
