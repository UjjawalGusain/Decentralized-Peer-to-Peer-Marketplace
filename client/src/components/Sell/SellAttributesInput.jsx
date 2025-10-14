import React from "react";
import { useFieldArray } from "react-hook-form";

export default function AttributesInput({ control, register }) {
  const { fields, append, remove } = useFieldArray({ control, name: "attributes" });
  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-9 gap-2 items-center">
          <input {...register(`attributes.${index}.key`)} placeholder="Key (e.g. RAM)" className="col-span-4 px-3 py-2 border border-yellow-300 rounded-md w-full" />
          <input {...register(`attributes.${index}.value`)} placeholder="Value (e.g. 4GB)" className="col-span-4 px-3 py-2 border border-yellow-300 rounded-md w-full" />
          <button type="button" onClick={() => remove(index)} className="col-span-1 bg-red-500 text-white rounded px-2 py-1 hover:bg-slate-700">&times;</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ key: "", value: "" })} className="mt-2 px-4 py-2 bg-[#FEC010]">+ Add attribute</button>
    </div>
  );
}
