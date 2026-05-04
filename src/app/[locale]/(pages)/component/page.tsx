"use client";

import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";

import { useState } from "react";

export default function ComponentPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer1, setOpenDrawer1] = useState(false);
  const [openDrawer2, setOpenDrawer2] = useState(false);
  const [openDrawer3, setOpenDrawer3] = useState(false);
  return (
    <div className="space-y-10">
      {/* DIALOG */}
      <button onClick={() => setOpenModal((prev) => !prev)}>Open Modal</button>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Delete account"
        size="md"
        footer={
          <>
            <button
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white">
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete your account?</p>
      </Modal>

      {/* BUTTON */}
      <Button
        onClick={() => alert("Test")}
        label="Test Button"
        className="bg-red-300"
        isOutline={false}
        isLarge={false}
        isFullWidth={false}
        disabled={false}
        isLoading={false}
      />

      {/* Right-side navigation drawer */}
      <button onClick={() => setOpenDrawer1((prev) => !prev)}>
        Open Drawer
      </button>
      <Drawer
        isOpen={openDrawer1}
        onClose={() => setOpenDrawer1(false)}
        side="right"
        size="md"
        title="Settings"
        description="Manage your preferences"
      >
        <nav className="space-y-2">
          <a className="block p-3 rounded-lg hover:bg-gray-100">Profile</a>
          <a className="block p-3 rounded-lg hover:bg-gray-100">Account</a>
          <a className="block p-3 rounded-lg hover:bg-gray-100">Billing</a>
        </nav>
      </Drawer>

      {/* // Left-side menu */}
      <button onClick={() => setOpenDrawer2((prev) => !prev)}>
        Open Drawer
      </button>
      <Drawer
        isOpen={openDrawer2}
        onClose={() => setOpenDrawer2(false)}
        side="left"
        size="sm"
        title="Menu"
      >
        <p>Menu</p>
      </Drawer>

      {/* // Bottom sheet (mobile-friendly) */}
      <button onClick={() => setOpenDrawer3((prev) => !prev)}>
        Open Drawer
      </button>
      <Drawer
        isOpen={openDrawer3}
        onClose={() => setOpenDrawer3(false)}
        side="bottom"
        size="lg"
        title="Share"
        footer={
          <>
            <button onClick={close} className="px-4 py-2 rounded-lg border">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
              Share
            </button>
          </>
        }
      >
        <p>Choose how you&apos;d like to share this.</p>
      </Drawer>
    </div>
  );
}
