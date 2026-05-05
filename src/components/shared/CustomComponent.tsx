"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import Dropdown from "@/components/ui/Dropdown";
import { ArrowRight, Crown, Heart, Sparkle, Star, Trash, User2 } from "lucide-react";

export default function UIShowcasePage() {
  return (
    <div className="space-y-12 card">
      <h2>Custom UI Showcase</h2>
      <ModalSection />
      <ButtonSection />
      <DrawerSection />
      <DropdownSection />
    </div>
  );
}

//
// ================= MODAL =================
//
function ModalSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Modal</h2>

      <button onClick={() => setOpen(true)}>Open Modal</button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete account"
        footer={
          <>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete your account?</p>
      </Modal>
    </div>
  );
}

//
// ================= BUTTONS =================
//
function ButtonSection() {
  const [isLoved, setIsLoved] = useState(false);
  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Buttons</h2>

      <div className="flex gap-4 flex-wrap">
        <Button label="Get Started" variant="primary" size="lg" glow />
        <Button label="Upgrade Pro ✨" variant="gradient" size="lg" isRounded />
        <Button label="Delete" variant="danger" leftIcon={<Trash />} />
        <Button label="Cancel" variant="ghost" />
        <Button icon={<Heart />} variant="outline" isRounded size="sm" />
        <Button label="Saving..." isLoading variant="success" />
        <Button label="Legacy" isOutline isLarge />
      </div>
      <h1 className="text-xl font-semibold">Css Base Button</h1>
      <div className="flex gap-4 flex-wrap">
        <button className="btn btn-primary btn-hover-overlay ">Primary</button>
        <button className="btn btn-secondary btn-hover-overlay">Secondary</button>
        <button className="btn btn-gradient btn-hover-overlay">Gradient</button>
        <button className="btn btn-natural btn-hover-overlay">Natural</button>
        <button className="btn btn-danger btn-hover-overlay"><Trash size={16}/>Delete</button>
        <button className="btn btn-success btn-hover-overlay">Success</button>
        <button className="btn btn-warning btn-hover-overlay">Warning</button>
        <button className="btn btn-info btn-hover-overlay">Details <ArrowRight size={16}/></button>
        <button className="btn btn-light btn-hover-overlay">Light</button>
        <button className="btn btn-dark btn-hover-overlay">Dark</button>
        <button className="btn btn-outline btn-hover-overlay">Outline</button>
        <button className="btn btn-circle btn-hover-overlay btn-natural"><User2 size={18}/></button>
        <button onClick={() => setIsLoved(!isLoved)} className={`btn btn-circle btn-hover-overlay ${isLoved ? "btn-danger" : "btn-natural"}`}><Heart size={18}/></button>
      </div>
    </div>
  );
}

//
// ================= DRAWERS =================
//
function DrawerSection() {
  const [right, setRight] = useState(false);
  const [left, setLeft] = useState(false);
  const [bottom, setBottom] = useState(false);

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Drawers</h2>

      <div className="flex gap-3">
        <button onClick={() => setRight(true)}>Right Drawer</button>
        <button onClick={() => setLeft(true)}>Left Drawer</button>
        <button onClick={() => setBottom(true)}>Bottom Drawer</button>
      </div>

      <Drawer
        isOpen={right}
        onClose={() => setRight(false)}
        side="right"
        title="Settings"
      >
        <p>Right Drawer Content</p>
      </Drawer>

      <Drawer
        isOpen={left}
        onClose={() => setLeft(false)}
        side="left"
        title="Menu"
      >
        <p>Left Drawer Content</p>
      </Drawer>

      <Drawer
        isOpen={bottom}
        onClose={() => setBottom(false)}
        side="bottom"
        title="Share"
        footer={
          <>
            <button
              onClick={() => setBottom(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
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

//
// ================= DROPDOWNS =================
//
function DropdownSection() {
  const [country, setCountry] = useState("");
  const [plan, setPlan] = useState("");

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Dropdowns</h2>

      <Dropdown
        label="Country"
        placeholder="Choose a country"
        options={[
          { label: "Bangladesh", value: "bd" },
          { label: "India", value: "in" },
          { label: "USA", value: "us" },
        ]}
        value={country}
        onChange={(v) => setCountry(v as string)}
      />

      <Dropdown
        label="Plan"
        searchable
        clearable
        options={[
          {
            label: "Free",
            value: "free",
            icon: <Sparkle />,
            description: "For personal projects",
          },
          {
            label: "Pro",
            value: "pro",
            icon: <Star />,
            description: "$9/month — for teams",
          },
          {
            label: "Enterprise",
            value: "ent",
            icon: <Crown />,
            description: "Custom pricing",
            disabled: true,
          },
        ]}
        value={plan}
        onChange={(v) => setPlan(v as string)}
      />
    </div>
  );
}
