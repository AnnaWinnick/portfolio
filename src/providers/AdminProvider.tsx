"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  isEditing: boolean;
  toggleEditing: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isEditing: false,
  toggleEditing: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isEditing,
        toggleEditing: () => setIsEditing((prev) => !prev),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
