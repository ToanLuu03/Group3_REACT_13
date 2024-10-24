import { Input } from 'antd';
import React, { useState } from 'react'
const trainees = [
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      fptAccount: 'ANV69',
      email: 'A@gmail.com',
      nationalID: '123456789',
      employeeID: '',
      accessCardID: '',
      dob: '11-Dec-1969',
      gender: 'Male',
      status: 'Active',
    },
    {
      id: 2,
      fullName: 'Nguyễn Văn Bò',
      fptAccount: 'BoNV69',
      email: 'B@gmail.com',
      nationalID: '987654321',
      employeeID: '',
      accessCardID: '',
      dob: '22-Dec-1969',
      gender: 'Female',
      status: 'Active',
    },
    {
      id: 3,
      fullName: 'Nguyễn Văn Cờ',
      fptAccount: 'CoNV69',
      email: 'C@gmail.com',
      nationalID: '123123123',
      employeeID: '',
      accessCardID: '',
      dob: '33-Dec-1969',
      gender: 'Other',
      status: 'Active',
    },
  ];
const TraineeList = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter the trainees list based on the search query
    const filteredTrainees = trainees.filter((trainee) =>
      trainee.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <div className="p-4">
        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search Trainees"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-[272px] mb-4"
        />
  
        {/* Table */}
        <table className="min-w-full table-auto border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="border bg-[#E8E8E8] block md:table-row">
              <th className="p-2 text-left font-semibold block md:table-cell">No.</th>
              <th className="p-2 text-left font-semibold block md:table-cell">Full Name</th>
              <th className="p-2 text-left font-semibold block md:table-cell">FPT Account</th>
              <th className="p-2 text-left font-semibold block md:table-cell">Personal Email</th>
              <th className="p-2 text-left font-semibold block md:table-cell">National ID</th>
              <th className="p-2 text-left font-semibold block md:table-cell">Employee ID</th>
              <th className="p-2 text-left font-semibold block md:table-cell">Access Card ID</th>
              <th className="p-2 text-left font-semibold block md:table-cell">DOB</th>
              <th className="p-2 text-left font-semibold block md:table-cell">Gender</th>
              <th className="p-2 text-left font-semibold block md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {filteredTrainees.map((trainee, index) => (
              <tr
                key={trainee.id}
                className="border border-gray-300 block md:table-row"
              >
                <td className="p-2 border block md:table-cell">{index + 1}</td>
                <td className="p-2 border block md:table-cell">
                  <a href="#" className="text-blue-500">
                    {trainee.fullName}
                  </a>
                </td>
                <td className="p-2 block md:table-cell border">{trainee.fptAccount}</td>
                <td className="p-2 block md:table-cell border">{trainee.email}</td>
                <td className="p-2 block md:table-cell border">{trainee.nationalID}</td>
                <td className="p-2 block md:table-cell border">{trainee.employeeID || ''}</td>
                <td className="p-2 block md:table-cell border">{trainee.accessCardID || ''}</td>
                <td className="p-2 block md:table-cell border">{trainee.dob}</td>
                <td className="p-2 block md:table-cell border">{trainee.gender}</td>
                <td className="p-2 block md:table-cell border">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      trainee.status === 'Active'
                        ? 'bg-green-400'
                        : 'bg-red-400'
                    }`}
                  >
                    {trainee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default TraineeList
