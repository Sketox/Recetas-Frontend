"use client";

import { useState } from "react";
import { availableIcons, getIconComponent } from "@/utils/IconSelector";
import { useAuth } from "@/context/AuthContext";

export default function IconPicker() {
  const { userIcon, setUserIcon } = useAuth();
  const [selectedIcon, setSelectedIcon] = useState(userIcon);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const icon = e.target.value;
    setLoading(true);
    try {
      const res = await fetch("/api/user/icon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newIcon: icon }),
      });

      if (res.ok) {
        localStorage.setItem("userIcon", icon);
        setSelectedIcon(icon);
        setUserIcon(icon);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error al actualizar el ícono:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <select
        value={selectedIcon || ""}
        onChange={handleChange}
        className="border px-4 py-2 rounded-md shadow-sm"
        disabled={loading}
      >
        {availableIcons.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>

      <div className="mt-2">
        {selectedIcon && (() => {
          const IconComponent = getIconComponent(selectedIcon);
          return <IconComponent />;
        })()}
      </div>

      {success && <p className="text-green-600 text-sm mt-2">¡Ícono actualizado!</p>}
    </div>
  );
}
