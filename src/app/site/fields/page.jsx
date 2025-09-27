"use client";
import { useEffect, useState } from "react";
import { getFields } from "@/services/fieldService";
import FieldCard from "@/components/site/field/FieldCard";

export default function FieldList() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    getFields()
      .then((res) => setFields(res.data || []))
      .catch((err) => console.error("❌ Lỗi fetch fields:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {fields.map((f) => (
        <FieldCard key={f._id} field={f} />
      ))}
    </div>
  );
}
