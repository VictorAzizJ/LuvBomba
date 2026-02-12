import { RetroButton } from "./RetroButton";

export type DeliveryMethod = "sms" | "email";

export function DeliveryMethodPicker({
  value,
  onChange,
}: {
  value: DeliveryMethod;
  onChange: (value: DeliveryMethod) => void;
}) {
  return (
    <div className="flex gap-3" role="radiogroup" aria-label="Delivery method">
      <RetroButton
        type="button"
        role="radio"
        aria-checked={value === "sms"}
        className={value === "sms" ? "bg-mint ring-2 ring-ink" : "bg-lavender"}
        onClick={() => onChange("sms")}
      >
        SMS
      </RetroButton>
      <RetroButton
        type="button"
        role="radio"
        aria-checked={value === "email"}
        className={value === "email" ? "bg-mint ring-2 ring-ink" : "bg-lavender"}
        onClick={() => onChange("email")}
      >
        Email
      </RetroButton>
    </div>
  );
}
