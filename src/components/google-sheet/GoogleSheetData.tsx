"use client";

import { deleteUser, getUsers, updateUser, User } from "@/lib/google-sheet";
import React, { useEffect, useState, useTransition } from "react";

export default function GoogleSheetData() {
  const [data, setData] = useState<User[]>([]);
  const [showData, setShowData] = useState(true); // Defaulted to true to show the table
  const [isPending, startTransition] = useTransition();

  // State to track which user is currently being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  // Fetch all users from Google Sheet
  const fetchData = () => {
    startTransition(async () => {
      try {
        const result = await getUsers();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set active row into edit mode
  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email });
  };

  // Submit updated row data
  const handleSaveUpdate = async (id: string) => {
    if (!editForm.name || !editForm.email) return;

    startTransition(async () => {
      try {
        const response = await updateUser({ id, ...editForm });
        if (response.success) {
          // Optimistically update the local state UI
          setData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, ...editForm } : item,
            ),
          );
          setEditingId(null); // Close editing mode
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.error("Update error:", error);
      }
    });
  };

  // Delete specific user row
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    startTransition(async () => {
      try {
        const result = await deleteUser(id);
        if (result.success) {
          // Remove the deleted row from UI state instantly
          setData((prev) => prev.filter((user) => user.id !== id));
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-4 w-full max-w-4xl mx-auto p-4">
      {/* Toggle Button */}
      <div className="flex gap-2 items-center border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800 flex-1 text-left">
          Google Sheet Sync
        </h2>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition"
        >
          Refresh
        </button>
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition"
          onClick={() => setShowData(!showData)}
        >
          {showData ? "Hide Table" : "Show Table"}
        </button>
      </div>

      {/* Global Action Pending / Loading State */}
      {isPending && (
        <div className="text-sm text-blue-600 animate-pulse font-medium">
          Processing request with Google Sheets...
        </div>
      )}

      {/* Simple Clean Table */}
      {showData && (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="border-b border-foreground/10 uppercase text-xs font-semibold">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">
                    No data found or connecting to Google Sheet...
                  </td>
                </tr>
              ) : (
                data.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-900/10 transition-colors"
                  >
                    <td className="p-3 font-mono text-xs text-gray-400">
                      {user.id}
                    </td>

                    {/* Inline Edit View for Name & Email */}
                    <td className="p-3">
                      {editingId === user.id ? (
                        <input
                          type="text"
                          className="border border-foreground/10 px-2 py-1 rounded w-full max-w-xs focus:outline-blue-500"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === user.id ? (
                        <input
                          type="email"
                          className="border border-foreground/10 px-2 py-1 rounded w-full max-w-xs focus:outline-blue-500"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </td>

                    {/* Row Control Action Buttons */}
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      {editingId === user.id ? (
                        <>
                          <button
                            onClick={() => handleSaveUpdate(user.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            disabled={isPending}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            disabled={isPending}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
