import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type DietaryPreferences = {
  vegetarian: boolean;
  vegan: boolean;
  nonVegetarian: boolean;
  glutenFree: boolean;
  sugarFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
};

interface PreferencesFormProps {
  value: DietaryPreferences;
  onChange: (value: DietaryPreferences) => void;
}

const PreferencesForm = ({ value, onChange }: PreferencesFormProps) => {
  const [local, setLocal] = useState(value);

  const toggle = (key: keyof DietaryPreferences) => {
    const next = { ...local, [key]: !local[key] };
    setLocal(next);
    onChange(next);
  };

  const Item = ({ id, label }: { id: keyof DietaryPreferences; label: string }) => (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={local[id]} onCheckedChange={() => toggle(id)} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );

  return (
    <div className="card-elevated p-6 md:p-8">
      <h3 className="text-lg font-semibold mb-4">Dietary preferences</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Item id="vegetarian" label="Vegetarian" />
        <Item id="vegan" label="Vegan" />
        <Item id="nonVegetarian" label="Non‑vegetarian" />
        <Item id="glutenFree" label="Gluten‑free" />
        <Item id="sugarFree" label="Sugar‑free" />
        <Item id="dairyFree" label="Dairy‑free" />
        <Item id="nutFree" label="Nut‑free" />
      </div>
    </div>
  );
};

export default PreferencesForm;
