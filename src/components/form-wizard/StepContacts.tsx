"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { ContactInfo, Contact } from "@/types";

interface Props {
  data: ContactInfo;
  onChange: (data: ContactInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

function ContactFields({
  label,
  contact,
  onChange,
  prefix,
}: {
  label: string;
  contact: Contact;
  onChange: (c: Contact) => void;
  prefix: string;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="font-medium">{label}</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor={`${prefix}-name`}>Name</Label>
          <Input
            id={`${prefix}-name`}
            value={contact.name}
            onChange={(e) => onChange({ ...contact, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${prefix}-email`}>Email</Label>
          <Input
            id={`${prefix}-email`}
            type="email"
            value={contact.email}
            onChange={(e) => onChange({ ...contact, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${prefix}-phone`}>Phone</Label>
          <Input
            id={`${prefix}-phone`}
            value={contact.phone}
            onChange={(e) => onChange({ ...contact, phone: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  );
}

export function StepContacts({ data, onChange, onNext, onBack }: Props) {
  const [showBroker, setShowBroker] = useState(!!data.brokerContact);
  const [showAgent, setShowAgent] = useState(!!data.generalAgentContact);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

      <ContactFields
        label="Primary Contact *"
        contact={data.primaryContact}
        onChange={(c) => onChange({ ...data, primaryContact: c })}
        prefix="primary"
      />

      <div className="flex items-center space-x-3">
        <Checkbox
          id="addBroker"
          checked={showBroker}
          onCheckedChange={(v) => {
            setShowBroker(!!v);
            if (!v) onChange({ ...data, brokerContact: undefined });
            else
              onChange({
                ...data,
                brokerContact: { name: "", email: "", phone: "" },
              });
          }}
        />
        <Label htmlFor="addBroker" className="font-normal">
          Add Broker Contact
        </Label>
      </div>

      {showBroker && data.brokerContact && (
        <ContactFields
          label="Broker Contact"
          contact={data.brokerContact}
          onChange={(c) => onChange({ ...data, brokerContact: c })}
          prefix="broker"
        />
      )}

      <div className="flex items-center space-x-3">
        <Checkbox
          id="addAgent"
          checked={showAgent}
          onCheckedChange={(v) => {
            setShowAgent(!!v);
            if (!v) onChange({ ...data, generalAgentContact: undefined });
            else
              onChange({
                ...data,
                generalAgentContact: { name: "", email: "", phone: "" },
              });
          }}
        />
        <Label htmlFor="addAgent" className="font-normal">
          Add General Agent Contact
        </Label>
      </div>

      {showAgent && data.generalAgentContact && (
        <ContactFields
          label="General Agent Contact"
          contact={data.generalAgentContact}
          onChange={(c) => onChange({ ...data, generalAgentContact: c })}
          prefix="agent"
        />
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
