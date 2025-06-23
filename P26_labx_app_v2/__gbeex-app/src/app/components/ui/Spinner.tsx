import React from "react";

const Spinner: React.FC = () => (
  <div className="flex justify-center items-end gap-1 py-4 h-6">
    <div className="w-1.5 h-3 bg-blue-500 animate-[pulse_1s_ease-in-out_infinite]" />
    <div className="w-1.5 h-5 bg-blue-500 animate-[pulse_1s_ease-in-out_infinite_0.2s]" />
    <div className="w-1.5 h-4 bg-blue-500 animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
  </div>
);

export default React.memo(Spinner);
