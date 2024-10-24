import React, { useState } from "react";
import dayjs from "dayjs";
import {
  DeliveryOptions,
  FormatOptions,
  StatusOptions,
} from "./DataPlannedSelectOptions";
import SelectOptions from "../../../components/portal/SelectOptions";
import SelectDate from "../../../components/portal/SelectDate";
import { Button } from "antd";
import { Search } from "lucide-react";

const SelectPlannedTraining = () => {
  const [deliveryType, setDeliveryType] = useState([]);
  const [status, setStatus] = useState("");
  const [trainingFormat, setTrainingFormat] = useState("");
  const [scheduleStart, setScheduleStart] = useState(null);
  const [scheduleEnd, setScheduleEnd] = useState(null);
  const [actualStart, setActualStart] = useState(null);
  const [actualEnd, setActualEnd] = useState(null);

  const handleDeliveryChange = (value) => {
    setDeliveryType(value);
    console.log("Delivery Type:", value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    console.log("Status:", value);
  };

  const handleTrainingFormatChange = (value) => {
    setTrainingFormat(value);
    console.log("Training Format:", value);
  };

  const handleScheduleStartChange = (date) => {
    setScheduleStart(date);
  };

  const handleScheduleEndChange = (date) => {
    setScheduleEnd(date);
  };

  const handleActualStartChange = (date) => {
    setActualStart(date);
    console.log("Actual (start):", date);
  };

  const handleActualEndChange = (date) => {
    setActualEnd(date);
    console.log("Actual (end):", date);
  };

  return (
    <div className="flex flex-col m-3">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Delivery Type</h2>
          <SelectOptions
            mode={"multiple"}
            options={DeliveryOptions}
            placeholder={"Please select delivery type"}
            onChange={handleDeliveryChange}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <SelectOptions
            options={StatusOptions}
            placeholder={"Please select status"}
            onChange={handleStatusChange}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Training Format</h2>
          <SelectOptions
            options={FormatOptions}
            placeholder={"Please select training format"}
            onChange={handleTrainingFormatChange}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Schedule (start)</h2>
          <SelectDate
            placeholder="The topic from ..."
            onChange={handleScheduleStartChange}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Schedule (end)</h2>
          <SelectDate placeholder="to ..." onChange={handleScheduleEndChange} />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Actual (start)</h2>
          <SelectDate
            placeholder="Topic taught ..."
            onChange={handleActualStartChange}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Actual (end)</h2>
          <SelectDate placeholder="to ..." onChange={handleActualEndChange} />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Search</h2>
          <div className="flex flex-grow max-w-[600px]">
            <input
              type="search"
              placeholder="Search..."
              className="rounded-l-lg text-sm border border-gray-300 h-[32px] py-1 px-4 w-full focus:border-blue-500 outline-none"
            />
            <Button
              type="submit"
              className="py-2 bg-neutral-50 rounded-l-none rounded-r-lg border-secondary-border border-gray-300 border-l-0 flex-shrink-0"
            >
              <Search />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-8 m-3">
        <div>
          <span>
            <b>Start Date:</b>{" "}
            {scheduleStart
              ? dayjs(scheduleStart).format("DD/MM/YYYY")
              : "Not selected"}
          </span>
        </div>
        <div>
          <span>
            <b>End Date:</b>{" "}
            {scheduleEnd
              ? dayjs(scheduleEnd).format("DD/MM/YYYY")
              : "Not selected"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectPlannedTraining;
