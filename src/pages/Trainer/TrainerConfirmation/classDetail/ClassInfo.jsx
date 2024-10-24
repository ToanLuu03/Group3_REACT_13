import React from 'react';

const ClassInfo = () => {
  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <tbody>
            {/* Row 1 */}
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Class Name</th>
              <td className="border border-gray-300 px-4 py-2">HCM24_FRF_FJW_04</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Delivery Type</th>
              <td className="border border-gray-300 px-4 py-2">Class</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Trainee Type</th>
              <td className="border border-gray-300 px-4 py-2">Fresher with Fee</td>
            </tr>

            {/* Row 2 */}
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Format Type</th>
              <td className="border border-gray-300 px-4 py-2">Offline</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Request Group</th>
              <td className="border border-gray-300 px-4 py-2">1. App Dev</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Request Subgroup</th>
              <td className="border border-gray-300 px-4 py-2">Java</td>
            </tr>

            {/* Row 3 */}
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Technical Group</th>
              <td className="border border-gray-300 px-4 py-2">Java</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Training Program</th>
              <td className="border border-gray-300 px-4 py-2">Fullstack Java Web Develop</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Site</th>
              <td className="border border-gray-300 px-4 py-2">TP. Ho Chi Minh</td>
            </tr>

            {/* Row 4 */}
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Location</th>
              <td className="border border-gray-300 px-4 py-2">Center Building HCM</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Expected Start Date</th>
              <td className="border border-gray-300 px-4 py-2">10-Jun-2024</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Expected End Date</th>
              <td className="border border-gray-300 px-4 py-2">13-Dec-2024</td>
            </tr>

            {/* Row 5 */}
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Planned Trainee No</th>
              <td className="border border-gray-300 px-4 py-2">11</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Subject Type</th>
              <td className="border border-gray-300 px-4 py-2">IT Technical</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Planned Revenue</th>
              <td className="border border-gray-300 px-4 py-2">0 VND</td>
            </tr>

            {/* Row 6 */}
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Scope</th>
              <td className="border border-gray-300 px-4 py-2">Company</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Supplier/Partner</th>
              <td className="border border-gray-300 px-4 py-2">FPT Software</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Key Program</th>
              <td className="border border-gray-300 px-4 py-2">FP General class</td>
            </tr>

            {/* Row 7 */}
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Global SE</th>
              <td className="border border-gray-300 px-4 py-2">No</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Job Recommendation</th>
              <td className="border border-gray-300 px-4 py-2">No</td>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Salary Paid</th>
              <td className="border border-gray-300 px-4 py-2">No</td>
            </tr>

            {/* Row 8 */}
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Note</th>
              <td className="border border-gray-300 px-4 py-2" colSpan="5"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassInfo;
