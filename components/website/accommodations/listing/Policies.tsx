import React from "react";
import { IoCheckmarkDone } from "react-icons/io5";

const Policies = () => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-primary text-xs font-semibold">House rules</h3>
        <p className="text-gray-600 text-xs/relaxed mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          exercitationem explicabo necessitatibus quos beatae dolore repudiandae
          corporis cupiditate.
        </p>
      </div>
      <div>
        <h3 className="text-primary text-xs font-semibold">Refund policy</h3>
        <p className="text-gray-600 text-xs/relaxed mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          exercitationem explicabo necessitatibus quos beatae dolore repudiandae
          corporis cupiditate.
        </p>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          {/* <MdSmokingRooms size={13} className="text-primary" /> */}
          <h3 className="text-primary text-xs font-semibold">Smoking policy</h3>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <IoCheckmarkDone size={20} className="text-green-600" />
          <p className="text-gray-600 text-xs/relaxed">Allowed</p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          {/* <MdOutlinePets size={13} className="text-primary" /> */}
          <h3 className="text-primary text-xs font-semibold">Pet policy</h3>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <IoCheckmarkDone size={20} className="text-green-600" />
          <p className="text-gray-600 text-xs/relaxed">Allowed</p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          {/* <GiPartyPopper size={13} className="text-primary" /> */}
          <h3 className="text-primary text-xs font-semibold">
            Event and Parties
          </h3>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <IoCheckmarkDone size={20} className="text-green-600" />
          <p className="text-gray-600 text-xs/relaxed">Allowed</p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          {/* <FaChildren size={13} className="text-primary" /> */}
          <h3 className="text-primary text-xs font-semibold">Children</h3>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <IoCheckmarkDone size={20} className="text-green-600" />
          <p className="text-gray-600 text-xs/relaxed">Allowed</p>
        </div>
      </div>
      <div>
        <h3 className="text-primary text-xs font-semibold">Age restriction</h3>
        <div className="flex items-center gap-1.5 mt-2">
          <IoCheckmarkDone size={20} className="text-green-600" />
          <p className="text-gray-600 text-xs/relaxed">Allowed</p>
        </div>
      </div>
    </div>
  );
};

export default Policies;